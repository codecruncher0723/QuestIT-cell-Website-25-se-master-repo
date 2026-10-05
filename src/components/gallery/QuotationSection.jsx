"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const QuotationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const quote = "What started as Quest-IT slowly turned strangers into a family connected by unforgettable moments together.";
  const words = quote.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[35vh] md:min-h-[45vh] w-full flex items-center justify-center bg-gradient-to-b from-[#02060f] via-zinc-950 to-black py-10 md:py-16 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, color: "#6B7280" }}
              animate={
                isVisible
                  ? {
                      opacity: 1,
                      color: "#22d3ee",
                    }
                  : { opacity: 0, color: "#6B7280" }
              }
              transition={{
                opacity: {
                  duration: 0.3,
                  delay: index * 0.08,
                },
                color: {
                  duration: 2,
                  delay: 1.5 + index * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              className="inline-block mr-2 md:mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.blockquote>

        {/* Decorative quote marks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="absolute top-10 left-4 md:left-10 text-6xl md:text-8xl text-cyan-400/20 font-serif"
        >
          "
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="absolute bottom-10 right-4 md:right-10 text-6xl md:text-8xl text-cyan-400/20 font-serif"
        >
          "
        </motion.div>
      </div>
    </section>
  );
};

export default QuotationSection;
