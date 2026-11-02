"use client";

// React's Imports
import { useEffect, useState } from "react";

// Next's Imports
import Image from "next/image";
import Link from "next/link";

// App's Internal Imports
import { Button } from "@/components/ui/button";

// App's External Imports
import { motion } from "framer-motion";
import { Trophy, ExternalLink, Mail } from "lucide-react";
import confetti from "canvas-confetti";

const winners = [
  {
    rank: "1st Rank 🥇",
    name: "Snehansu Deo",
    email: "2025.snehansu.deo@ves.ac.in",
    link: "https://cosmo-os-eight.vercel.app/",
    thumbnail: "/images/vibeWQuest_photos/thumbnail_1.webp",
    description: "Unique UI inspired by Human Interface Guidelines with technical distinctiveness.",
    color: "from-yellow-400 to-amber-600",
    shadow: "shadow-yellow-500/50",
    border: "border-yellow-400",
  },
  {
    rank: "1st Runner Up 🥈",
    name: "Hardik Verma",
    email: "ihardiks.1711@gmail.com",
    link: "https://cosmossos.vercel.app/",
    thumbnail: "/images/vibeWQuest_photos/thumbnail_2.webp",
    description: "Simple UI with properly working functionalities and integrated music system.",
    color: "from-gray-300 to-gray-500",
    shadow: "shadow-gray-400/50",
    border: "border-gray-300",
  },
  {
    rank: "2nd Runner Up 🥉",
    name: "Soham Kadam",
    email: "2025.soham.kadam@ves.ac.in",
    link: "https://cosmos-5kpc-eta.vercel.app/",
    thumbnail: "/images/vibeWQuest_photos/thumbnail_3.webp",
    description: "Proper layout with advanced AI chatbot integration for intelligent interactions.",
    color: "from-orange-400 to-amber-700",
    shadow: "shadow-orange-500/50",
    border: "border-orange-400",
  },
];

const VibeWQuestWinners = () => {
  const [mounted, setMounted] = useState(false);

  // Celebration confetti animation
  const triggerCelebration = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 12000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from multiple angles
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount: particleCount / 2,
        origin: { x: 0.5, y: 0.5 },
      });
    }, 250);
  };

  useEffect(() => {
    setMounted(true);
    // Trigger celebration confetti on page load
    const timer = setTimeout(() => {
      triggerCelebration();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-20"
        >
          <div className="flex justify-center items-center gap-4 mb-8">
            <Trophy className="w-16 h-16 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Winners of
            </h1>
            <Trophy className="w-16 h-16 text-cyan-400" />
          </div>

          <div className="relative w-full flex justify-center mb-8 px-4">
            <Image
              src="/images/vibeWQuest_photos/vibeWquest_logo.webp"
              alt="Vibe W Quest Logo"
              width={858}
              height={135}
              sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 450px, (max-width: 1280px) 550px, 650px"
              className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[550px] xl:max-w-[650px] h-auto object-contain"
              priority
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto"
          >
            Celebrating exceptional creativity and technical excellence in AI-powered development. 
            Congratulations to our outstanding winners! 🎉
          </motion.p>
        </motion.div>

        {/* Winners Rows - Alternating Layout */}
        <div className="space-y-12 mb-12">
          {winners.map((winner, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
                className="relative"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-6 bg-neutral-900 rounded-2xl overflow-hidden border-2 ${winner.border} ${winner.shadow} shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8`}
                >
                  {/* Thumbnail Section */}
                  <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    {/* Rank Badge */}
                    <div
                      className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-gradient-to-r ${winner.color} font-bold text-white text-sm shadow-lg`}
                    >
                      {winner.rank}
                    </div>
                    
                    <div className="relative h-64 lg:h-full min-h-[300px] rounded-xl overflow-hidden group">
                      <Image
                        src={winner.thumbnail}
                        alt={`${winner.name} - ${winner.rank}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent"></div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className={`flex flex-col justify-center space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        {winner.name}
                      </h2>
                      <div className="flex items-center gap-2 text-neutral-400 text-base">
                        <Mail size={18} />
                        <span>{winner.email}</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-base lg:text-lg leading-relaxed">
                      {winner.description}
                    </p>

                    {/* Visit Project Button */}
                    <Link
                      href={winner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        className={`w-full lg:w-auto px-8 py-4 bg-gradient-to-r ${winner.color} hover:opacity-90 text-white font-semibold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg`}
                      >
                        <ExternalLink size={20} />
                        Visit Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back to Events Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/events">
            <Button className="px-8 py-4 text-lg bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Back to Events
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default VibeWQuestWinners;
