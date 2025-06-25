// signupFormDemo.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/support/UserContext";
import Link from "next/link";
import { IconBrandGoogle, IconBrandDiscord } from "@tabler/icons-react";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function SignupFormDemo({ filter }) {
  const [session, setSession] = useState(null);
  const { setUserDetails } = useUser();
  const router = useRouter();
  const [state, setState] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await fetchUserDetails(session.user);

        // Check if the user signed up with Google or Discord
        const { data: existingUser, error: fetchError } = await supabase
          .from("user_details")
          .select("auth_provider")
          .eq("email", session.user.email)
          .maybeSingle();

        if (fetchError) throw new Error(fetchError.message);

        // If the user doesn't exist in the user_details table, insert them
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from("user_details")
            .insert([
              {
                email: session.user.email,
                auth_provider: session.user.app_metadata.provider || "email", // Get the provider from session
                city: "", 
              },
            ]);

          if (insertError) throw new Error(insertError.message);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserDetails(session.user);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserDetails = async (user) => {
    if (!user?.email) return;

    const { data, error } = await supabase
      .from("user_details")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user details:", error.message);
      return;
    }

    if (data) {
      localStorage.setItem("userDetails", JSON.stringify(data));
      setUserDetails(data);
      if (filter) {
        router.replace(`/details?filter=${filter}`);
      } else {
        router.replace("/chat-history"); // Redirect to chat history if details exist
      }
    } else {
      // If no details, redirect to user-details page, passing the filter if it exists
      const redirectPath = filter ? `/user-details?filter=${filter}` : "/user-details";
      router.replace(redirectPath);
    }
  };

  const debouncedHandleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      let response;
      if (state === "signup") {
        // Check if user exists before proceeding
        const { data: existingUser, error: fetchError } = await supabase
          .from("user_details")
          .select("email, auth_provider")
          .eq("email", email);

        if (fetchError) throw new Error(fetchError.message);

        if (existingUser?.length > 0) {
          throw new Error("User already exists with this email");
        }

        // Sign up the user
        response = await supabase.auth.signUp({
          email,
          password,
        });

        if (response.error) throw new Error(response.error.message);

        // Send welcome email
        const verificationLink = `${window.location.origin}/verify-email?token=${response.data?.user?.confirmation_token}`;
        
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            templateName: 'signup',
            data: {
              userName: email.split('@')[0],
              verificationLink
            }
          })
        });

        setError('Please check your email to verify your account!');
      } else {
        // Login logic
        const { data: existingUser, error: fetchError } = await supabase
          .from("user_details")
          .select("auth_provider")
          .eq("email", email)
          .maybeSingle();

        if (fetchError) throw new Error(fetchError.message);

        // If the user does not exist, show an error message
        if (!existingUser) {
          setError("Please sign up first.");
          setLoading(false);
          return;
        }

        // Check if the user signed up with Google
        if (existingUser?.auth_provider === "google") {
          setError("Please log in with Google.");
          setLoading(false);
          return;
        }

        // Proceed with email/password login
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) throw new Error(response.error.message);
        await fetchUserDetails(response.data.user);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [state, email, password]);

  const googleAuth = async () => {
    try {
      const redirectTo = filter
        ? `${window.location.origin}/signup?filter=${filter}`
        : `${window.location.origin}/signup`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const discordAuth = async () => {
    try {
      const redirectTo = filter
        ? `${window.location.origin}/signup?filter=${filter}`
        : `${window.location.origin}/signup`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      setError(error.message);
    }
  };

  return (<>
    <div
      className="font-[family-name:var(--font-garamond)] bg-white/40 backdrop-blur-lg 
lg:p-8 lg:px-20 p-8 px:10 md:px-20 rounded-3xl shadow-lg border border-white/30"
    >
      <p className="text-center text-[#333] text-2xl mb-2 font-bold">
        Welcome
      </p>
      <h1 className="text-xl text-[#333] font-bold text-center">
        {state === "login" ? "Login" : "Sign Up"}
      </h1>

      {error && (
        <div className="text-red-500 text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      <form className="my-8 border-none" onSubmit={debouncedHandleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="mb-1 text-[#333] text-md">
            Email Address
          </Label>
          <Input
            className="border border-gray-300 bg-white/80 rounded-md p-2 text-md focus:outline-none 
        focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-[#333]"
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="mb-1 text-[#333] text-md">
            Password
          </Label>
          <Input
            className="border border-gray-300 bg-white/80 rounded-md p-2 text-md focus:outline-none 
        focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-[#333]"
            id="password"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {state === "login" && (
            <p
              className="text-orange-500 cursor-pointer text-sm mt-2"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot Password?
            </p>
          )}
        </LabelInputContainer>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-gradient-to-r from-orange-400/80 via-pink-400/80 to-purple-400/80 
      hover:from-orange-400/90 hover:via-pink-400/90 hover:to-purple-400/90 backdrop-blur-md 
      text-white font-medium text-lg rounded mt-6 shadow-md transition-all ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
          disabled={loading}
        >
          {loading ? "Processing..." : state === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <div
        className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 
  to-transparent my-4 h-[1px] w-full"
      />

      <div className="flex flex-col space-y-4 mt-4">
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="button"
          onClick={googleAuth}
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Continue with Google
          </span>
          <BottomGradient />
        </button>
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="button"
          onClick={discordAuth}
        >
          <IconBrandDiscord className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Continue with Discord
          </span>
          <BottomGradient />
        </button>
      </div>

      <p className="text-center mt-4 text-md text-[#333]">
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <span
          className="text-orange-500 cursor-pointer hover:underline"
          onClick={() => setState(state === "login" ? "signup" : "login")}
        >
          {state === "login" ? " Sign Up" : " Login"}
        </span>
      </p>
    </div>
      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};