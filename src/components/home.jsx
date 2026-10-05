"use client";

// Next's Imports
import Image from "next/image";

// App's Internal Imports
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";

// App's External Imports
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      <HeroHighlight id="home" className="relative">
        <motion.h1
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Empowering <span className="hidden md:inline">innovation,</span>
          <span className="md:hidden">&</span> shaping the future.{" "}
          <span className="hidden md:inline">QuestIT</span>
          <span className="md:hidden">We</span> redefines{" "}
          <Highlight className="text-white">
            what&apos;s possible in tech.
          </Highlight>
        </motion.h1>
      </HeroHighlight>

      <div className="relative left-1/2 w-[100vw] -translate-x-1/2 flex z-10 min-h-[70vh] lg:min-h-[85vh] -mt-4 md:-mt-8 lg:-mt-10">
        <Image
          src="/images/Genesis2.0banner.webp"
          alt="Genesis 2.0 Banner"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover block m-0 p-0"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
          priority
        />

        <div className="relative z-10 flex flex-col justify-center w-full px-6 md:px-12 lg:px-24 xl:px-32 pt-[5%]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-start max-w-2xl"
          >
            <p className="text-white/60 tracking-[0.3em] uppercase text-xs md:text-sm mb-4 ml-1">
              Upcoming Event
            </p>

            <Image
              src="/images/Genesis2.0logo.webp"
              alt="Genesis 2.0"
              width={1000}
              height={500}
              className="w-full max-w-[280px] md:max-w-[380px] lg:max-w-[500px] h-auto mb-6 drop-shadow-lg"
              priority
            />

            <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed max-w-xl">
              Genesis 2.0 is QuestIT&apos;s flagship hackathon, bringing together
              curious minds, creative thinkers and problem solvers to build
              impactful solutions over 24 hours. Ideate. Build. Collaborate. Create
              what&apos;s next.
            </p>

            <a 
              href="https://questit.vesit.ves.ac.in/genesis-cour2/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit group flex items-center gap-3 border border-orange-500/40 bg-black/40 hover:bg-orange-500/40 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] backdrop-blur-sm px-10 py-4 text-base md:text-lg text-orange-100 hover:text-white transition-all duration-300 rounded-lg"
            >
              Explore Genesis 2.0
              <span className="text-2xl leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Home;