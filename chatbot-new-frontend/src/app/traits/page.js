"use client";
import React, { useState, useEffect } from "react";
import { useTraits } from "@/support/TraitsContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, MessageCircle, Sparkles } from "lucide-react";
import { useBot } from "@/support/BotContext";

const TraitsPage = () => {
  const {
    selectedTraits,
    setSelectedTraits,
    selectedLanguage,
    setSelectedLanguage,
  } = useTraits();

  const traits = [
    "Bold/Adventurous",
    "Bubbly/Positive",
    "Curious",
    "Funny",
    "Intellectual Conversations",
    "Gentle/Quiet",
    "Introverted",
    "Open Minded",
    "Opinionated",
    "Outgoing",
    "Sarcastic",
  ];

  const romantic_traits = ["Playful/Teasing", "Romantic", "Flirty"];
  const [languages, setLanguages] = useState([]);
  const { selectedBotId } = useBot();

  useEffect(() => {
    // checks the selected bot's origin from the bot_id and sets the languages based on it
    if (selectedBotId.includes('delhi')) {
      setLanguages(["English", "Hinglish"]);
    } else if (selectedBotId.includes('japanese')) {
      setLanguages(["English", "Japanese"]);
    } else if (selectedBotId.includes('berlin')) {
      setLanguages(["English", "German"]);
    } else if (selectedBotId.includes('parisian')) {
      setLanguages(["English", "French"]);
    } else {
      setLanguages(["English"]); // Default language if filter doesn't match
    }

  }, [selectedBotId, setLanguages]);

  const toggleTrait = (trait) => {
    setSelectedTraits((prevTraits) => {
      if (prevTraits.includes(trait)) {
        return prevTraits.filter((t) => t !== trait);
      }
      if (prevTraits.length >= 2) {
        return prevTraits; // Don't add more traits if already at limit
      }
      return [...prevTraits, trait];
    });
  };

  return (
    <div
      className="min-h-screen flex bg-gray-100 items-center justify-center p-4 relative overflow-hidden font-[family-name:var(--font-garamond)]"
    >
      <div className="absolute inset-0 -z-0">
        <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full blur-[150px] top-10 left-20 opacity-50"></div>
        <div className="absolute w-[500px] h-[500px] bg-orange-300 rounded-full blur-[150px] bottom-10 left-20 opacity-50"></div>

        <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full blur-[150px] top-10 right-20 opacity-50"></div>
        <div className="absolute w-[500px] h-[500px] bg-orange-300 rounded-full blur-[150px] bottom-10 right-20 opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative  bg-white/20  backdrop-blur-sm shadow-mdrounded-3xl p-8 max-w-4xl w-full border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-white/20 before:to-white/5 before:backdrop-blur-xl after:absolute after:inset-0 after:-z-10 after:rounded-3xl after:bg-white/10 after:blur-xl after:transition-all hover:after:blur-2xl"
      >
        {/* Content */}
        <div className="relative z-10">
          {/* Personality Selection */}
          <div className="mb-12">
            <h2 className="text-xl md:text-3xl text-black mb-2 font-semibold">
              Personality
            </h2>
            <p className="text-m text-black/90 mb-8 font-light">
              Select up to two traits that match your style
            </p>
            <div className="flex flex-wrap gap-3">
              {traits.map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`px-6 py-2 md:px-6 md:py-3 bg-white/5 hover:bg-gradient-to-r from-purple-300/80 via-pink-300/80 to-orange-300/80 text-black text-md rounded-full flex items-center gap-2 transition-all backdrop-blur-md border border-white/20 shadow-[0_4px_12px_0_rgba(255,255,255,0.1)] ${
                    selectedTraits.includes(trait)
                      ? "bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-orange-400/60 text-white "
                      : ""
                  }`}
                >
                  {trait}
                </button>
              ))}
              {selectedTraits.includes("Romantic") &&
                romantic_traits.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-6 py-2 md:px-6 md:py-3 bg-white/5 hover:bg-gradient-to-r from-purple-300/80 via-pink-300/80 to-orange-300/80 text-black rounded-full flex items-center gap-2 transition-all backdrop-blur-md border border-white/20 shadow-[0_4px_12px_0_rgba(255,255,255,0.1)] ${
                      selectedTraits.includes(trait)
                        ? "bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-orange-400/60 text-white"
                        : ""
                    }`}
                  >
                    {trait}
                  </button>
                ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-12">
            <h2 className="text-xl md:text-3xl text-black mb-2 font-semibold">
              Language
            </h2>
            <p className="text-m text-black/90 mb-8 font-light">
              Choose your preferred language
            </p>
            <div className="flex gap-3">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => setSelectedLanguage(language)}
                  className={`px-6 py-2 md:px-6 md:py-3 bg-white/5 hover:bg-gradient-to-r from-purple-300/80 via-pink-300/80 to-orange-300/80 text-black rounded-full flex items-center gap-2 transition-all backdrop-blur-md border border-white/20 shadow-[0_4px_12px_0_rgba(255,255,255,0.1)] ${
                    selectedLanguage === language
                      ? "bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-orange-400/60 text-white"
                      : ""
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Link
              href="/chat"
              className="px-6 py-2 md:px-6 md:py-3 text-lg bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-orange-400/80 hover:from-purple-400/90 hover:via-pink-400/90 hover:to-orange-400/90 text-white rounded-full flex justify-center items-center gap-2 transition-all backdrop-blur-sm border border-white/20 shadow-[0_4px_12px_0_rgba(255,255,255,0.2)]"
            >
              <MessageCircle size={20} />
              Start Chatting
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TraitsPage;
