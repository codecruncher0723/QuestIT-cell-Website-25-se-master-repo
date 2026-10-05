"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const LogoSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      {/* Background Ambient Dark Tech Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        {/* Soft Radial Center Backlight */}
        <div
          className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[90px] md:blur-[140px] pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 212, 255, 0.25) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)",
          }}
        />

        {/* Ambient Subtle Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #00d4ff 1px, transparent 1px), linear-gradient(to bottom, #00d4ff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Master Animated Lockup Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-full">
        {/* Top Row Lockup: Logo Badge + QUEST IT Text */}
        <motion.div
          className="relative z-20 flex items-center justify-center"
          layout
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo Badge Container (Starts very small -> grows -> glows temporarily -> glow fades after gallery appears) */}
          <div className="relative z-20 shrink-0 flex items-center justify-center">
            {/* Ambient Cyan Aura Flare behind Badge (Ignites then fades away completely to 0 once Gallery appears) */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.25, 1.1, 0.8],
                opacity: [0, 0.95, 0.7, 0],
              }}
              transition={{
                delay: 0.35,
                duration: 1.4,
                times: [0, 0.25, 0.65, 1],
                ease: "easeInOut",
              }}
              className="absolute w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] md:w-[240px] md:h-[240px] rounded-full blur-[35px] sm:blur-[50px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0, 212, 255, 0.85) 0%, rgba(34, 211, 238, 0.35) 45%, transparent 75%)",
              }}
            />

            {/* The Badge Image with Temporary Glow that removes once Gallery appears */}
            <motion.div
              initial={{
                scale: 0.08,
                opacity: 0,
                rotate: -35,
                filter: "drop-shadow(0 0 0px rgba(0,212,255,0))",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                filter: [
                  "drop-shadow(0 0 0px rgba(0,212,255,0))",
                  "drop-shadow(0 0 25px rgba(0,212,255,0.85)) drop-shadow(0 0 45px rgba(0,212,255,0.4))",
                  "drop-shadow(0 0 15px rgba(0,212,255,0.5))",
                  "drop-shadow(0 0 0px rgba(0,212,255,0))",
                ],
              }}
              transition={{
                scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.35 },
                rotate: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                filter: {
                  delay: 0.35,
                  duration: 1.4,
                  times: [0, 0.3, 0.65, 1],
                  ease: "easeInOut",
                },
              }}
              className="relative w-[95px] h-[95px] sm:w-[130px] sm:h-[130px] md:w-[165px] md:h-[165px] lg:w-[185px] lg:h-[185px]"
            >
              <Image
                src="/images/quest-badge-logo.png"
                alt="QUEST IT Badge Logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </div>

          {/* "QUEST IT" Text (Appears on the right from behind the logo) */}
          <motion.div
            className="relative z-10 overflow-hidden flex items-center"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{
              delay: 0.75,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.div
              className="whitespace-nowrap pl-3 sm:pl-5 md:pl-7 flex items-center"
              initial={{ x: -80, opacity: 0, filter: "blur(6px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                delay: 0.8,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">
                QUEST
              </span>
              <span className="ml-2 sm:ml-3 font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-cyan-400 tracking-wider drop-shadow-[0_0_18px_rgba(0,212,255,0.75)]">
                IT
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Lockup: Bright White "GALLERY" Text (Appears from behind logo and text moving down) */}
        <div className="relative z-0 flex flex-col items-center mt-3 sm:mt-5 overflow-visible">
          <motion.div
            initial={{ y: -45, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: 1.5,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center justify-center gap-3 sm:gap-5"
          >
            {/* Elegant Accent Lines */}
            <div className="h-[1px] w-6 sm:w-12 md:w-20 bg-gradient-to-r from-transparent to-white/70" />

            <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-medium tracking-[0.45em] sm:tracking-[0.6em] md:tracking-[0.75em] uppercase text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.85)]">
              Gallery
            </h1>

            <div className="h-[1px] w-6 sm:w-12 md:w-20 bg-gradient-to-l from-transparent to-white/70" />
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="absolute bottom-6 sm:bottom-10 flex flex-col items-center gap-2 text-gray-400 select-none pointer-events-none"
      >
        <span className="text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase font-mono text-cyan-400/80">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LogoSection;
