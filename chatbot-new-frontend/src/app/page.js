"use client"
import Link from "next/link";
import { HeaderLabel } from "@/components/HeaderLabel";
import { useState, useEffect } from "react";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { FlipWords } from "@/components/ui/flip-words";
import FooterLayout from "@/components/FooterLayout";
import Header from "@/components/Header";
import { useUser } from "@/support/UserContext";

export default function Home() {

  const [linkDestination, setLinkDestination] = useState(""); // Default for server rendering
  const words = ["Caring", "Relatable", "Genuine", "Empathetic", "Playful"];
  const {userDetails} = useUser();

  useEffect(() => {
    // This will only run after hydration on the client side
    if (userDetails?.name) {
      setLinkDestination("/details?filter=Spiritual%20Guide");
    } else {
      setLinkDestination("/signup?filter=Spiritual%20Guide") ;
    }
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="w-full font-[family-name:var(--font-garamond)] overflow-x-hidden bg-[#FFFBF7]"
    >
      {/* Hero Section with Gradient Background */}
      <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center gap-12 text-center px-6 sm:px-10">
        <div className="absolute inset-0 -z-10">
          <BackgroundGradientAnimation /> {/* Applies animated gradient background to the hero section */}
        </div>

         {/* Navbar */}
         <Header/>

        {/* Hero Content */}
        <div className="text-center mt-12 sm:mt-28">

          <Link href={linkDestination}>
            <HeaderLabel /> {/* Displays header label component (gradient text), linked based on username */}
          </Link>

          <p className="text-md md:text-xl font-semibold text-[#363636] mt-10 sm:mt-10">
            CultureVo presents to you {/* Intro text */}
          </p>
          <p className="bg-clip-text text-transparent font-bold drop-shadow-2xl bg-gradient-to-b from-white to-white/20 text-5xl sm:text-8xl md:text-8xl mt-4">
            NOVI AI {/* Main title */}
          </p>
          
          {/* Text animation */}
          <div className="mt-5 ">
            <span className="text-center text-[#363636] font-bold mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl ">Your</span>
            <div className="min-w-[100px] sm:min-w-[168px] inline-block">
            <FlipWords 
              words={words} 
              className="text-center text-[#242124] font-bold text-xl sm:text-2xl md:text-3xl"
            /></div>
            <span className="text-center text-[#363636] font-bold mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl ">AI companions from all over the world.</span>
          </div>

          {/* Animated text effect */}
          <TextGenerateEffect
            words={
              "With all the care in the world for you."
            } 
            className="text-center text-[#363636] font-bold sm:mt-5 text-xl sm:text-2xl md:text-3xl"
          />

          {/* Button to signup page */} 
          <Link href="/signup">
            <button className="mt-20 sm:mt-20 bg-[#242124] px-4 py-2 rounded-lg text-white text-sm sm:text-base hover:bg-gradient-to-r from-pink-400 to-orange-400">
              Start Chatting
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-16 sm:pt-20 px-6 sm:px-10 pb-20 sm:pb-40">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#242124] text-center mb-10 sm:mb-16">
          Your NOVI is {/* Section title */}
        </h2>

        {/* Feature Cards */}
        <div className="max-w-full mx-auto flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            // card content
            {
              title: "Culturally Intelligent", // card 1 title
              text: "Your Novi is culturally adept to the city they belong to. They know the city like a local - its personality, offerings, and challenges.", //card 1 text
            },
            {
              title: "Emotionally Intelligent", //card 2 title
              text: "NOVI will understand you like no other. Discuss your life's dreams, hopes, fears, and goals with them. They will care for you, for who you are!", //card 2 text
            },
            {
              title: "Always there for you", //card 3 title
              text: "Treat your NOVI as your constant source for emotional sustenance. They are always available for you, when the world might not be.", //card 3 text
            },
          ].map(({ title, text }, index) => (
            <div
  key={index}
  className="py-20 px-6 sm:py-20 sm:px-8 rounded-lg shadow-lg text-black max-w-[90%] sm:max-w-[350px] mx-2 sm:mx-4 
             animate-fadeInScale transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl"
  style={{
    background: `
      radial-gradient(circle at 20% 30%, #FDECEF 30%, transparent 60%), 
      radial-gradient(circle at 80% 20%, #EAF9F0 30%, transparent 60%), 
      radial-gradient(circle at 40% 80%, #F1E8FA 30%, transparent 60%), 
      linear-gradient(to bottom right, #FDECEF, #EAF9F0, #F1E8FA)`,
  }}
>
  <h3 className="font-semibold text-center text-xl mb-4">{title}</h3>
  <p className="text-lg sm:text-lg">{text}</p>
</div>

          ))}
        </div>
      </section>

      {/* Footer */}
      <FooterLayout/>
    </div>
  );
}
