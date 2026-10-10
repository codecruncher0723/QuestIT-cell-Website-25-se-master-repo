"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  id,
  children,
  className,
  containerClassName,
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const rectRef = React.useRef(null);

  function handleMouseEnter({ currentTarget }) {
    if (currentTarget) {
      rectRef.current = currentTarget.getBoundingClientRect();
    }
  }

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    if (!rectRef.current && currentTarget) {
      rectRef.current = currentTarget.getBoundingClientRect();
    }
    if (rectRef.current) {
      mouseX.set(clientX - rectRef.current.left);
      mouseY.set(clientY - rectRef.current.top);
    }
  }

  return (
    <div
      id={id}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className={cn(
        containerClassName,
        "relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group"
      )}
    >
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800  pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({ children, className }) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block pb-1   px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
        className
      )}
    >
      {children}
    </motion.span>
  );
};
