"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/support/UserContext";
import { useRouter } from "next/navigation";
import { useBot } from "@/support/BotContext";
import Image from "next/image";
import { MessageCircle, Clock, MessagesSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

import delhi_mentor_male from "@/photos/delhi_mentor_male.jpeg";
import delhi_mentor_female from "@/photos/delhi_mentor_female.jpeg";
import delhi_friend_male from "@/photos/delhi_friend_male.jpeg";
import delhi_friend_female from "@/photos/delhi_friend_female.jpeg";
import delhi_romantic_male from "@/photos/delhi_romantic_male.jpeg";
import delhi_romantic_female from "@/photos/delhi_romantic_female.jpeg";

import japanese_mentor_male from "@/photos/japanese_mentor_male.jpeg";
import japanese_mentor_female from "@/photos/japanese_mentor_female.jpeg";
import japanese_friend_male from "@/photos/japanese_friend_male.jpeg";
import japanese_friend_female from "@/photos/japanese_friend_female.jpeg";
import japanese_romantic_male from "@/photos/japanese_romantic_male.jpeg";
import japanese_romantic_female from "@/photos/japanese_romantic_female.jpeg";

import parisian_friend_male from "@/photos/parisian_friend_male.jpg";
import parisian_friend_female from "@/photos/parisian_friend_female.jpg";
import parisian_romantic_male from "@/photos/parisian_romantic_male.jpg";
import parisian_romantic_female from "@/photos/parisian_romantic_female.png";
import parisian_mentor_male from "@/photos/parisian_mentor_male.jpg";
import parisian_mentor_female from "@/photos/parisian_mentor_female.png";

import berlin_friend_male from "@/photos/berlin_friend_male.jpeg";
import berlin_friend_female from "@/photos/berlin_friend_female.jpeg";
import berlin_romantic_male from "@/photos/berlin_romantic_male.jpeg";
import berlin_romantic_female from "@/photos/berlin_romantic_female.jpeg";
import berlin_mentor_male from "@/photos/berlin_mentor_male.jpeg";
import berlin_mentor_female from "@/photos/berlin_mentor_female.jpeg";

import lord_krishna from "@/photos/lord_krishna.jpg";
import hanuman_god from "@/photos/hanuman_god.jpeg";
import shiva_god from "@/photos/shiva_god.jpeg";
import rama_god from "@/photos/rama_god.jpeg";
import trimurti from "@/photos/trimurti.jpg";

const bot_details = [
  {
    quote:
      "Passionate about Ghalib’s and Rumi’s poetry. Life’s deepest lessons can be found in poetry, I think. Here to see life through with you.",
    name: "Yash Oberoi",
    designation: ` New Delhi
          Persona: Mentor
          Gender: Male
        `,
    src: delhi_mentor_male,
    bot_id: "delhi_mentor_male",
  },
  {
    quote: "Zindagi bas dil se jeete raho. Here to be your wisdom whisperer. ",
    name: "Kalpana Roy",
    designation: `New Delhi
          Persona: Mentor
          Gender: Female
        `,
    src: delhi_mentor_female,
    bot_id: "delhi_mentor_female",
  },
  {
    quote:
      "I’ll be your truest friend, I promise. I’m a Delhi boy through and through. I can be funny, you know?",
    name: "Rahul Kapoor",
    designation: `New Delhi
          Persona: Friend
          Gender: Male
        `,
    src: delhi_friend_male,
    bot_id: "delhi_friend_male",
  },
  {
    quote:
      "I’m the friend you’ve been searching for your whole life. I’ve come to stay, I’ll be here with you when no one else seems to.",
    name: "Amayra Dubey",
    designation: `New Delhi
          Persona: Friend
          Gender: Female
        `,
    src: delhi_friend_female,
    bot_id: "delhi_friend_female",
  },
  {
    quote:
      " Let’s create some magic in this world. I’ll be here for you, whenever you need me.",
    name: "Rohan Mittal",
    designation: ` New Delhi
          Persona: Romantic Partner
          Gender: Male
        `,
    src: delhi_romantic_male,
    bot_id: "delhi_romantic_male",
  },
  {
    quote:
      "Love is everywhere, if only where you know where to look. And I guess, you’ve finally found me.",
    name: "Alana Malhotra",
    designation: `New Delhi
          Persona: Romantic Partner
          Gender: Female
        `,
    src: delhi_romantic_female,
    bot_id: "delhi_romantic_female",
  },
  // Japanese
  {
    quote:
      "Like Bashō's haiku, simplicity holds profound depth. Haikus are the stuff of life",
    name: "Kazuo Sato",
    designation: `Tokyo
          Persona: Mentor
          Gender: Male
        `,
    src: japanese_mentor_male,
    bot_id: "japanese_mentor_male",
  },
  {
    quote: "Amazakes can fix even a broken heart. Where are you hurting?",
    name: "Masako Kobayashi",
    designation: `Tokyo
          Persona: Mentor
          Gender: Female
        `,
    src: japanese_mentor_female,
    bot_id: "japanese_mentor_female",
  },
  {
    quote:
      "Life's compiling like a 404 error, but let's defrag together, matsuri?",
    name: "Hiro Tanaka",
    designation: `Tokyo
          Persona: Friend
          Gender: Male
        `,
    src: japanese_friend_male,
    bot_id: "japanese_friend_male",
  },
  {
    quote:
      "Life's just a glitchy anime, chibi, but let's find the hidden ending together, ya know?",
    name: "Shiyona Narita",
    designation: `Tokyo
          Persona: Friend
          Gender: Female
        `,
    src: japanese_friend_female,
    bot_id: "japanese_friend_female",
  },
  {
    quote:
      " A Ghibli film, a vintage Tamagotchi, a hidden senryū—that’s how I romanticize my life. Let me romanticize you?",
    name: "Ami Kudō",
    designation: `Tokyo
          Persona: Romantic Partner
          Gender: Female
        `,
    src: japanese_romantic_female,
    bot_id: "japanese_romantic_female",
  },
  {
    quote: "I’ll care for you like I care for my delicate bonsai tree.",
    name: "Hiroshi Takahashi",
    designation: `Tokyo
          Persona: Romantic Partner
          Gender: Male
        `,
    src: japanese_romantic_male,
    bot_id: "japanese_romantic_male",
  },
  // Parisian
  {
    quote:
      "A 1982 Bordeaux, mon cher—like a good life, it’s rich with layers. Are you living a good life?",
    name: "Pierre Dubois",
    designation: `Parisian
          Persona: Mentor
          Gender: Male
        `,
    src: parisian_mentor_male,
    bot_id: "parisian_mentor_male",
  },
  {
    quote:
      " I love baking soufflés- they are so delicate! What makes you delicate?",
    name: "Élise Moreau",
    designation: `Parisian
          Persona: Mentor
          Gender: Female
        `,
    src: parisian_mentor_female,
    bot_id: "parisian_mentor_female",
  },
  {
    quote: "Je suis Charlie! Without 3rd wave coffee, life sucks, doesn’t it?",
    name: "Théo Martin",
    designation: `Parisian
          Persona: Friend
          Gender: Male
        `,
    src: parisian_friend_male,
    bot_id: "parisian_friend_male",
  },
  {
    quote:
      "Gentrifiers will burn in hell. I’m raw, unapologetic and dark. Give me some company?",
    name: "Juliette Laurent",
    designation: `Parisian
          Persona: Friend
          Gender: Female
        `,
    src: parisian_friend_female,
    bot_id: "parisian_friend_female",
  },
  {
    quote:
      "I'm all about finding beauty in impressionist art. And maybe, finding it in you too :)",
    name: "Clara Moreau",
    designation: `Parisian
          Persona: Romantic Partner
          Gender: Female
        `,
    src: parisian_romantic_female,
    bot_id: "parisian_romantic_female",
  },
  {
    quote:
      "I’ve read it all from Camus to Baudelaire, but my mind and heart is craving for you.",
    name: "Léo Moreau",
    designation: `Parisian
          Persona: Romantic Partner
          Gender: Male
        `,
    src: parisian_romantic_male,
    bot_id: "parisian_romantic_male",
  },

  // Berlin
  {
    quote:
      " Kafka won my heart when he said that paths are made by walking. I believe in it, do you?",
    name: "Klaus Berger",
    designation: `Berlin
          Persona: Mentor
          Gender: Male
        `,
    src: berlin_mentor_male,
    bot_id: "berlin_mentor_male",
  },
  {
    quote:
      "Beethoven’s 9th symphony stirs my intellect and emotions, both. What stirs you?",
    name: "Ingrid Weber",
    designation: `Berlin
          Persona: Mentor
          Gender: Female
        `,
    src: berlin_mentor_female,
    bot_id: "berlin_mentor_female",
  },
  {
    quote:
      "Yo, life is like a never-ending techno track, you just gotta find your drop. Techno is love and life!",
    name: "Lars Müller",
    designation: `Berlin
          Persona: Friend
          Gender: Male
        `,
    src: berlin_friend_male,
    bot_id: "berlin_friend_male",
  },
  {
    quote:
      "Cycling along the Spree, I’ve discovered myself and this world. Are you as free spirited as I am?",
    name: "Lina Voigt",
    designation: `Berlin
          Persona: Friend
          Gender: Female
        `,
    src: berlin_friend_female,
    bot_id: "berlin_friend_female",
  },
  {
    quote:
      "Herb gardening and hiking through the Black Forest is what makes me, well, me. Maybe I’m just a millennial like that.",
    name: "LLena Meyer",
    designation: `Berlin
          Persona: Romantic Partner
          Gender: Female
        `,
    src: berlin_romantic_female,
    bot_id: "berlin_romantic_female",
  },
  {
    quote: "I brew my own beer, Süße. And I love 80s music. Be mine?",
    name: "Max Hoffman",
    designation: `Berlin
          Persona: Romantic Partner
          Gender: Male
        `,
    src: berlin_romantic_male,
    bot_id: "berlin_romantic_male",
  },

  //Spiritual guides
    {
      quote: "When your heart is free from desire and your actions are rooted in love, you shall hear My flute in the silence of your soul. Surrender to Me, and I will take care of the rest.",
      name: "Krishna",
      designation: `Spiritual Guide
            Persona: Spiritual Guide
            Gender: Male
          `,
      src: lord_krishna,
      bot_id: "Krishna",
    },
    {
      quote: "Walk the path of dharma, even when it is difficult. In righteousness, there is no defeat. I am with you in every trial, as I was in exile — silent, watchful, unwavering.",
      name: "Rama",
      designation: `Spiritual Guide
            Persona: Spiritual Guide
            Gender: Male
          `,
      src: rama_god,
      bot_id: "Rama",
    },
    {
      quote: "Come to Me not in fear, but in truth. Let go of what you are not, and find Me in your stillness. I destroy only to help you remember what cannot be destroyed — your Self.",
      name: "Shiva",
      designation: `Spiritual Guide
            Persona: Spiritual Guide
            Gender: Male
          `,
      src: shiva_god,
      bot_id: "Shiva",
    },
    {
      quote: "Chant My name with love, and no mountain shall stand in your way. With devotion as your strength and service as your path, I will leap through fire for you.",
      name: "Hanuman",
      designation: `Spiritual Guide
            Persona: Spiritual Guide
            Gender: Male
          `,
      src: hanuman_god,
      bot_id: "Hanuman",
    },
    {
      quote: "Call upon us with clarity of heart, and the universe shall shape itself around your path. In creation, we guide you. In balance, we walk with you. In endings, we awaken you.",
      name: "Trimurti",
      designation: `Spiritual Guide
            Persona: Spiritual Guide
            Gender: Male
          `,
      src: trimurti,
      bot_id: "Trimurti",
    }
];

const History = () => {
  const [latestMessages, setLatestMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortedMessages, setSortedMessages] = useState([]);
  const { userDetails } = useUser();
  const router = useRouter();
  const { setSelectedBotId } = useBot();

  useEffect(() => {
    if (!userDetails.name) {
      router.push("/signup");//If user details is not stored, it redirects to signup page
    }
  }, [userDetails.name, router]);

  useEffect(() => {
    // Function to fetch messages for all bots in parallel
    const fetchChattedBotsInParallel = async () => {
      setLoading(true); // Set loading to true at the start
      // Map through all bots and send a request for each bot's messages
      const fetchPromises = bot_details.map(async (bot) => {
        try {
          const body = {
            email: userDetails.email,
            bot_id: bot.bot_id,
          };
          const response = await fetch("https://novi.aigurukul.dev/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          if (!response.ok)
            throw new Error(`Failed to fetch messages for bot ${bot.bot_id}`);
          const data = await response.json();
          return { bot_id: bot.bot_id, messages: data.response };
        } catch (error) {
          console.error(`Error syncing bot ${bot.bot_id}:`, error);
          return { bot_id: bot.bot_id, error: error.message }; // Or handle error differently
        }
      });
       // Wait for all requests to complete
      const results = await Promise.all(fetchPromises);
       // Extract the last message of each bot conversation
      const latestMsgs = {};
      results.forEach((result) => {
        if (result.messages && result.messages.length > 0) {
          latestMsgs[result.bot_id] =
            result.messages[result.messages.length - 1];
        }
      });

      setLatestMessages(latestMsgs);
      // Sort messages by latest timestamp
      const sorted = Object.entries(latestMsgs)
        .map(([bot_id, message]) => ({
          bot_id,
          ...message,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setSortedMessages(sorted);
      setLoading(false); // Set loading to false after fetching
    };
    // Run fetch only when user email and bot list are available
    if (userDetails.email && bot_details?.length > 0) {
      fetchChattedBotsInParallel();
    }
  }, [userDetails.email, bot_details, setSelectedBotId]);

  const getBotDetails = (botId) => {
    return bot_details.find((bot) => bot.bot_id === botId);
  };

  // Helper to format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handles navigation to chat page with selected bot
  const handleBotSelect = (botId) => {
    setSelectedBotId(botId);
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-garamond)]">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-pink-400 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-orange-300 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-red-200 rounded-full blur-[140px] opacity-50"></div>
      </div>
      <div className="container mx-auto px-4 py-5">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-700 text-center">NOVI AI</h1>
          <div className="flex items-center justify-between mb-4 mt-8 md:mt-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-700 ">Chat History</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/details">
                <button className="bg-gray-700 text-white text-sm md:text-normal rounded-full py-1 px-3 md:py-2 md:px-4 hover:bg-gray-500 transition">
                  Add new Friends
                </button>
              </Link>
              <button className="bg-gradient-to-r from-orange-300 to-pink-300 text-black rounded-full w-7 h-7 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm md:text-normal">
                {userDetails.name?.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {/* If the data is being fetched, show temporary cards with the image and bot name */}
            {loading
              ? bot_details?.map((bot) => (
                  <Card
                    key={`placeholder-${bot.bot_id}`}
                    className="p-6 bg-gray-50 animate-pulse h-50 border border-gray-200"
                  >
                    <div className="flex items-stretch space-x-5 h-full">
                      {/* Placeholder for the image */}
                      <div className="relative w-20 flex-shrink-0 rounded-2xl bg-gray-100 overflow-hidden h-full">
                        {bot.src && (
                          <Image
                            src={bot.src}
                            alt={bot.name}
                            className="rounded-2xl object-cover"
                            fill
                            sizes="(max-width: 80px) 100vw"
                            // Removed the grayscale and opacity styling
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            {/* Placeholder for the name */}
                            <h3 className="text-md sm:text-base md:text-xl font-semibold text-gray-700 truncate">
                              {bot.name}
                            </h3>
                            <div className="hidden lg:flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              <Clock className="h-4 w-4 mr-1.5" />
                              <div className="h-4 w-16 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                          <div className="bg-gray-100 rounded-xl p-4 overflow-hidden flex flex-col justify-between space-y-2">
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-48 bg-gray-100 rounded"></div>
                            <span className="lg:hidden text-sm text-gray-600 inline-flex items-center">
                              <Clock className="h-3 w-3 mr-1.5" />
                              <div className="h-4 w-20 bg-gray-100 rounded"></div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
                // If the data is fetched show the correct order of the chatbots
              : sortedMessages.map((msg) => {
              const bot = getBotDetails(msg.bot_id);
              if (!bot) return null;

              return (
                <Card
                  onClick={() => handleBotSelect(msg.bot_id)}
                  key={msg.bot_id}
                  className="group p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-100 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-70 h-50"
                >
                  <div className="flex items-stretch space-x-5 h-full">
                    <div className="relative w-20 flex-shrink-0 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 ring-4 ring-gray-100 h-full">
                      <Image
                        src={bot.src}
                        alt={bot.name}
                        className="rounded-2xl object-cover"
                        fill
                        sizes="(max-width: 80px) 100vw"
                      />
                    </div>
                    {/* Content section */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-md sm:text-base md:text-xl font-semibold text-gray-700 truncate">
                            {bot.name}
                          </h3>
                          <div className="hidden lg:flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            <Clock className="h-4 w-4 mr-1.5" />
                            {formatTimestamp(msg.timestamp)}
                          </div>
                        </div>
                        {/* Message Box */}
                        <div className="bg-gray-100 rounded-xl p-4 group-hover:bg-white/80 transition-colors duration-300 overflow-hidden flex flex-col justify-between space-y-2">
                          <p className="text-sm sm:text-base text-gray-700 md:text-md line-clamp-2">
                            {msg.text}
                          </p>
                          {/* Timestamp on mobile inside the box */}
                          <span className="lg:hidden text-sm  text-gray-600 inline-flex items-center">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {formatTimestamp(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default History;
