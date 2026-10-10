"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className
}) => {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const id = React.useId();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Calculate spring physics on normalized 0..1 range (lightweight) instead of 10,000px
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 35,
    restDelta: 0.001,
  });

  const y1 = useTransform(smoothProgress, [0, 0.8], [50, svgHeight]);
  const y2 = useTransform(smoothProgress, [0, 1], [50, Math.max(50, svgHeight - 200)]);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === contentRef.current) {
            setSvgHeight(entry.target.offsetHeight);
          }
        }
      });

      ro.observe(contentRef.current);
      return () => ro.disconnect();
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full max-w-4xl mx-auto h-full", className)}
    >
      {/* Hide beam on mobile (< 768px) to eliminate mobile scroll stutter and layout clipping */}
      <div className="hidden md:block absolute -left-4 md:-left-20 top-3 pointer-events-none will-change-transform">
        <div className="ml-[27px] h-4 w-4 rounded-full border border-neutral-700 shadow-sm flex items-center justify-center bg-neutral-900">
          <div className="h-2 w-2 rounded-full border border-neutral-600 bg-cyan-400" />
        </div>
        {svgHeight > 0 && (
          <svg
            viewBox={`0 0 20 ${svgHeight}`}
            width="20"
            height={svgHeight}
            className="ml-4 block"
            aria-hidden="true"
          >
            <path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="#9091A0"
              strokeOpacity="0.16"
            />
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="1.25"
              className="motion-reduce:hidden"
            />
            <defs>
              <motion.linearGradient
                id={id}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={y1}
                y2={y2}
              >
                <stop stopColor="#18CCFC" stopOpacity="0" />
                <stop stopColor="#18CCFC" />
                <stop offset="0.325" stopColor="#6344F5" />
                <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        )}
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
