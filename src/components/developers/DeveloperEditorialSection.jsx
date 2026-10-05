"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import developers from "@/constants/developers";

const DEVELOPER_WORK_TITLES = {
  "Atharva Lotankar": "UI Redesign & Frontend Components",
  "Jay Kerkar": "Frontend Architecture & PWA",
  "Anish Tawade": "Website Data & Event Management",
  "Pranav Titambe": "Backend Optimization & Dynamic Workflows",
  "Karthik Kotian": "Gallery & Developer Section Redesign",
  "Shivam Mishra": "Genesis Microsite & Subpath Routing",
  "Avani Killekar": "Council 2026–27 & Media Standardization",
  "Chaitali Rane": "Council 2026–27 & Interactive UI Polish",
  "Sarra Khadse": "Council 2026–27 & UI Animations",
};

// Compute physical card stack transformation based on offset relative to active card
// offset = index - activeIndex
// offset === 0: Front active card
// offset < 0: Cards that were in front and moved backward and slightly down
// offset > 0: Cards waiting behind in the stack, ready to come forward
const getCardStyle = (offset, isMobile = false) => {
  if (offset === 0) {
    // Current Front Card (Dominant, active, full neon glow)
    return {
      x: "0%",
      y: "0px",
      scale: 1.0,
      rotateZ: 0,
      zIndex: 40,
      opacity: 1.0,
      glowOpacity: 1.0,
      overlayOpacity: 0.0,
    };
  }

  if (offset < 0) {
    // Current front card MOVES BACKWARD AND SLIGHTLY DOWN into the stack
    const absOffset = Math.abs(offset);
    if (absOffset === 1) {
      return {
        x: "0%",
        y: isMobile ? "20px" : "28px", // Moves backward and slightly down
        scale: 0.93,                  // Sinks backward in depth
        rotateZ: -1.5,
        zIndex: 25,
        opacity: 0.85,
        glowOpacity: 0.1,
        overlayOpacity: 0.45,
      };
    }
    if (absOffset === 2) {
      return {
        x: "0%",
        y: isMobile ? "34px" : "46px",
        scale: 0.87,
        rotateZ: -3,
        zIndex: 15,
        opacity: 0.55,
        glowOpacity: 0.0,
        overlayOpacity: 0.65,
      };
    }
    // absOffset >= 3
    return {
      x: "0%",
      y: isMobile ? "44px" : "60px",
      scale: 0.81,
      rotateZ: -4.5,
      zIndex: 10,
      opacity: 0.25,
      glowOpacity: 0.0,
      overlayOpacity: 0.8,
    };
  }

  // offset > 0: Cards waiting BEHIND in the stack
  // When scrolling to next, these shift forward one position
  if (offset === 1) {
    // Next card: sits right behind front card, ready to come forward
    return {
      x: "0%",
      y: isMobile ? "12px" : "16px",
      scale: 0.95,
      rotateZ: 1.5,
      zIndex: 35,
      opacity: 0.88,
      glowOpacity: 0.25,
      overlayOpacity: 0.35,
    };
  }
  if (offset === 2) {
    // 2 positions behind
    return {
      x: "0%",
      y: isMobile ? "22px" : "28px",
      scale: 0.89,
      rotateZ: 3,
      zIndex: 20,
      opacity: 0.6,
      glowOpacity: 0.0,
      overlayOpacity: 0.55,
    };
  }
  // offset >= 3
  return {
    x: "0%",
    y: isMobile ? "30px" : "38px",
    scale: 0.83,
    rotateZ: 4.5,
    zIndex: 10,
    opacity: 0.35,
    glowOpacity: 0.0,
    overlayOpacity: 0.75,
  };
};

const DeveloperEditorialSection = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isLockedRef = useRef(false);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  // Keep body overflow-x clip to prevent layout breaks on mobile while enabling smooth sticky/fixed positioning
  useEffect(() => {
    document.documentElement.style.setProperty("overflow-x", "clip", "important");
    document.body.style.setProperty("overflow-x", "clip", "important");
    return () => {
      document.documentElement.style.removeProperty("overflow-x");
      document.body.style.removeProperty("overflow-x");
    };
  }, []);

  // One-scroll step advances: exactly 1 wheel scroll or swipe moves the card stack
  const goToNext = () => {
    if (isLockedRef.current) return;
    const currentIdx = activeIndexRef.current;
    if (currentIdx < developers.length - 1) {
      isLockedRef.current = true;
      setDirection(1);
      setActiveIndex(currentIdx + 1);
      setTimeout(() => {
        isLockedRef.current = false;
      }, 680);
    } else {
      // At Last Developer: next scroll flows naturally into website Footer
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const goToPrev = () => {
    if (isLockedRef.current) return;
    const currentIdx = activeIndexRef.current;
    if (currentIdx > 0) {
      isLockedRef.current = true;
      setDirection(-1);
      setActiveIndex(currentIdx - 1);
      setTimeout(() => {
        isLockedRef.current = false;
      }, 680);
    }
  };

  // Wheel listener: 1 scroll gesture changes cards smoothly without stickiness
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer = null;

    const handleWheel = (e) => {
      const currentIdx = activeIndexRef.current;
      const scrollY = window.scrollY;

      // When viewing the developer section (top of page)
      if (scrollY <= 50) {
        if (e.deltaY > 0) {
          // Scrolling DOWN
          if (currentIdx < developers.length - 1) {
            e.preventDefault();
            accumulatedDelta += e.deltaY;
            if (!isLockedRef.current && (accumulatedDelta >= 20 || Math.abs(e.deltaY) >= 20)) {
              isLockedRef.current = true;
              accumulatedDelta = 0;
              setDirection(1);
              setActiveIndex(currentIdx + 1);
              setTimeout(() => {
                isLockedRef.current = false;
                accumulatedDelta = 0;
              }, 680);
            }
          } else {
            // At Last Developer: allow natural scroll down into website Footer
            if (e.deltaY > 30) {
              const footer = document.querySelector("footer");
              if (footer) {
                footer.scrollIntoView({ behavior: "smooth" });
              }
            }
          }
        } else if (e.deltaY < 0) {
          // Scrolling UP
          if (currentIdx > 0) {
            e.preventDefault();
            accumulatedDelta += e.deltaY;
            if (!isLockedRef.current && (Math.abs(accumulatedDelta) >= 20 || Math.abs(e.deltaY) >= 20)) {
              isLockedRef.current = true;
              accumulatedDelta = 0;
              setDirection(-1);
              setActiveIndex(currentIdx - 1);
              setTimeout(() => {
                isLockedRef.current = false;
                accumulatedDelta = 0;
              }, 680);
            }
          }
        }

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          accumulatedDelta = 0;
        }, 200);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(resetTimer);
    };
  }, []);

  // Touch swipe support for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e) => {
      const currentIdx = activeIndexRef.current;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (window.scrollY <= 40) {
        if (deltaY > 15 && currentIdx < developers.length - 1) {
          if (e.cancelable) e.preventDefault();
        } else if (deltaY < -15 && currentIdx > 0) {
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e) => {
      const currentIdx = activeIndexRef.current;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - touchStartTime;

      if (window.scrollY <= 50) {
        if ((deltaY > 25 || (deltaY > 12 && deltaTime < 250)) && currentIdx < developers.length - 1) {
          if (!isLockedRef.current) {
            isLockedRef.current = true;
            setDirection(1);
            setActiveIndex(currentIdx + 1);
            setTimeout(() => {
              isLockedRef.current = false;
            }, 680);
          }
        } else if ((deltaY < -25 || (deltaY < -12 && deltaTime < 250)) && currentIdx > 0) {
          if (!isLockedRef.current) {
            isLockedRef.current = true;
            setDirection(-1);
            setActiveIndex(currentIdx - 1);
            setTimeout(() => {
              isLockedRef.current = false;
            }, 680);
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIdx = activeIndexRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (currentIdx < developers.length - 1) {
          e.preventDefault();
          goToNext();
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (currentIdx > 0) {
          e.preventDefault();
          goToPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Subtle 3D Hover Tilt Physics:
  // Side closest to cursor moves slightly backward; opposite side comes slightly forward
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const MAX_TILT = 5.0; // Subtle maximum tilt degrees
    setTilt({
      rotateY: normX * 2 * MAX_TILT,
      rotateX: normY * 2 * MAX_TILT,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const currentDev = developers[activeIndex];
  const nameParts = currentDev.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const workTitle = DEVELOPER_WORK_TITLES[currentDev.name] || `${currentDev.role} Contribution`;

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-black text-white select-none overflow-x-hidden">
      {/* Fullscreen Editorial Stage - Padded below navbar to guarantee full clearance */}
      <div className="relative h-screen h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-black px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-[96px] sm:pt-[104px] md:pt-[112px] lg:pt-[116px] pb-4 sm:pb-6">
        {/* Subtle Ambient Radial Cyan Glow Behind Center Deck */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] lg:w-[750px] h-[300px] sm:h-[450px] md:h-[600px] lg:h-[750px] rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(34, 211, 238, 0.12) 0%, rgba(6, 182, 212, 0.04) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP & TABLET VIEW (>= 768px, md:)
            3-Column Editorial Grid:
            [ LEFT: Name + Role + Socials ] [ CENTER: 3D Stack ] [ RIGHT: Work ]
           ══════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-7xl mx-auto hidden md:grid md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1.1fr_auto_1.1fr] items-center md:gap-6 lg:gap-10 xl:gap-14 my-auto">
          {/* ── LEFT COLUMN: Developer Identity & Real Socials ── */}
          <div className="relative flex flex-col justify-center w-full">
            {/* Visual Anchor: Cyan Horizontal Line & DEVELOPER Label (Static) */}
            <div className="flex items-center gap-2.5 lg:gap-3">
              <span className="w-6 lg:w-8 h-[2px] bg-[#22d3ee] inline-block" />
              <span className="font-mono text-xs lg:text-sm tracking-[0.25em] text-[#22d3ee] font-semibold uppercase">
                DEVELOPER
              </span>
            </div>

            {/* Masked Vertical Reveal Window */}
            <div className="relative overflow-hidden w-full h-[220px] md:h-[230px] lg:h-[270px] xl:h-[300px] mt-2.5 lg:mt-4">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentDev.name}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      y: dir > 0 ? "115%" : "-115%",
                      opacity: 0,
                    }),
                    center: {
                      y: "0%",
                      opacity: 1,
                    },
                    exit: (dir) => ({
                      y: dir > 0 ? "-115%" : "115%",
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 w-full flex flex-col items-start text-left justify-start select-none"
                >
                  {/* Developer Name */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                    {firstName}
                    {lastName && (
                      <>
                        <br /> <span>{lastName}</span>
                      </>
                    )}
                  </h1>

                  {/* Role */}
                  <p className="mt-2 lg:mt-3 text-sm md:text-base lg:text-lg xl:text-xl text-neutral-400 font-medium">
                    {currentDev.role}
                  </p>

                  {/* Real Social Links */}
                  <div className="flex items-center gap-3 lg:gap-4 mt-5 lg:mt-7">
                    <a
                      href={currentDev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${currentDev.name} GitHub`}
                      className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 group"
                    >
                      <Github className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform group-hover:scale-110" />
                    </a>

                    <span className="text-neutral-700 text-sm select-none">|</span>

                    <a
                      href={currentDev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${currentDev.name} LinkedIn`}
                      className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 group"
                    >
                      <Linkedin className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform group-hover:scale-110" />
                    </a>

                    <span className="text-neutral-700 text-sm select-none">|</span>

                    <a
                      href={`mailto:${currentDev.email}`}
                      aria-label={`${currentDev.name} Email`}
                      className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 group"
                    >
                      <Mail className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform group-hover:scale-110" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── CENTER COLUMN: 3D Hero Card Stack with 4 Fanned Background Cards & Hover Tilt ── */}
          <div className="relative flex items-center justify-center my-2 sm:my-4">
            <motion.div
              animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
                mass: 0.8,
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative cursor-pointer w-[clamp(205px,22vw,320px)] h-[clamp(290px,47vh,450px)]"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* 4 Slightly Fanned Permanent Deck Cards Behind Center Hero */}
              {/* Fan Card 1 (Left Outer) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-[#22d3ee]/15 bg-[#03060f]/60 shadow-lg pointer-events-none"
                style={{
                  transform: "translate(-14%, 4%) rotate(-8deg) scale(0.90)",
                  zIndex: 1,
                }}
              />
              {/* Fan Card 2 (Left Inner) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-[#22d3ee]/25 bg-[#03060f]/60 shadow-lg pointer-events-none"
                style={{
                  transform: "translate(-7%, 2%) rotate(-4deg) scale(0.95)",
                  zIndex: 2,
                }}
              />
              {/* Fan Card 3 (Right Inner) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-[#22d3ee]/25 bg-[#03060f]/60 shadow-lg pointer-events-none"
                style={{
                  transform: "translate(7%, 2%) rotate(4deg) scale(0.95)",
                  zIndex: 2,
                }}
              />
              {/* Fan Card 4 (Right Outer) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-[#22d3ee]/15 bg-[#03060f]/60 shadow-lg pointer-events-none"
                style={{
                  transform: "translate(14%, 4%) rotate(8deg) scale(0.90)",
                  zIndex: 1,
                }}
              />

              {/* The 4 Developer Cards in Physical Card Deck Motion */}
              {developers.map((dev, idx) => {
                const offset = idx - activeIndex;
                const cardStyle = getCardStyle(offset, false);

                return (
                  <motion.div
                    key={dev.name}
                    animate={{
                      x: cardStyle.x,
                      y: cardStyle.y,
                      scale: cardStyle.scale,
                      rotateZ: cardStyle.rotateZ,
                      opacity: cardStyle.opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 22,
                      mass: 0.9,
                    }}
                    onClick={() => {
                      if (idx !== activeIndex) {
                        setDirection(idx > activeIndex ? 1 : -1);
                        setActiveIndex(idx);
                      }
                    }}
                    style={{
                      zIndex: cardStyle.zIndex,
                      transformOrigin: "center center",
                    }}
                    className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl select-none"
                  >
                    {/* Dynamic #22d3ee Neon Outer Aura */}
                    <motion.div
                      animate={{ opacity: cardStyle.glowOpacity }}
                      transition={{ duration: 0.35 }}
                      style={{
                        boxShadow:
                          "0 0 35px rgba(34, 211, 238, 0.45), 0 0 85px rgba(34, 211, 238, 0.22), 0 25px 60px rgba(0, 0, 0, 0.95)",
                      }}
                      className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
                    />

                    {/* Card Surface */}
                    <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border-[2px] md:border-[2.5px] border-[#22d3ee] bg-neutral-950">
                      <Image
                        src={dev.image}
                        alt={dev.name}
                        fill
                        quality={95}
                        priority={idx === 0}
                        sizes="(max-width: 1024px) 260px, (max-width: 1440px) 360px, 400px"
                        className="object-cover object-top rounded-[14px] md:rounded-[22px] select-none"
                      />

                      {/* Glass Dimming Tint when in stack */}
                      <motion.div
                        animate={{ opacity: cardStyle.overlayOpacity }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 bg-[#030712] pointer-events-none transition-colors"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Website Work & Contribution ── */}
          <div className="relative flex flex-col justify-center w-full">
            {/* Visual Anchor: Cyan Horizontal Line & WORKED ON WEBSITE Label (Static) */}
            <div className="flex items-center gap-2.5 lg:gap-3">
              <span className="w-6 lg:w-8 h-[2px] bg-[#22d3ee] inline-block" />
              <span className="font-mono text-xs lg:text-sm tracking-[0.25em] text-[#22d3ee] font-semibold uppercase">
                WORKED ON WEBSITE
              </span>
            </div>

            {/* Masked Vertical Reveal Window */}
            <div className="relative overflow-hidden w-full h-[220px] md:h-[230px] lg:h-[270px] xl:h-[300px] mt-2.5 lg:mt-4">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentDev.name}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      y: dir > 0 ? "115%" : "-115%",
                      opacity: 0,
                    }),
                    center: {
                      y: "0%",
                      opacity: 1,
                    },
                    exit: (dir) => ({
                      y: dir > 0 ? "-115%" : "115%",
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 w-full flex flex-col items-start text-left justify-start select-none"
                >
                  {/* Contribution Title */}
                  <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-snug">
                    {workTitle}
                  </h2>

                  {/* Authentic Description */}
                  <p className="mt-3 lg:mt-4 text-xs md:text-sm lg:text-base xl:text-lg text-neutral-300 leading-relaxed max-w-sm lg:max-w-md line-clamp-4 lg:line-clamp-none">
                    {currentDev.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE VIEW (< 768px, < md)
            Recomposed Vertically:
            1. Developer name
            2. 3D photo/card stack (Larger Card Dimensions)
            3. Work / contribution (Centered & Balanced Spacing)
            4. Social icons
           ══════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full flex md:hidden flex-col justify-start items-center h-full max-h-full pt-1 pb-3 px-3 max-w-sm mx-auto overflow-hidden">
          {/* 1. Developer Name with Static Visual Anchor & Masked Vertical Reveal */}
          <div className="relative w-full flex flex-col items-center justify-center shrink-0">
            <div className="flex items-center justify-center gap-2">
              <span className="w-5 h-[2px] bg-[#22d3ee] inline-block" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[#22d3ee] font-semibold uppercase">
                DEVELOPER
              </span>
            </div>

            <div className="relative overflow-hidden w-full h-[50px] sm:h-[56px] mt-0.5">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentDev.name}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      y: dir > 0 ? "115%" : "-115%",
                      opacity: 0,
                    }),
                    center: {
                      y: "0%",
                      opacity: 1,
                    },
                    exit: (dir) => ({
                      y: dir > 0 ? "-115%" : "115%",
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-start text-center select-none"
                >
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
                    {currentDev.name}
                  </h1>

                  <p className="mt-0.5 text-xs sm:text-sm text-neutral-400 font-medium">
                    {currentDev.role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 2. 3D Hero Card Stack with 4 Fanned Background Cards, Hover Tilt & Mobile Navigation Buttons */}
          <div className="relative w-full flex items-center justify-center mt-2 mb-3 shrink-0">
            {/* Mobile Previous Button */}
            <button
              type="button"
              onClick={goToPrev}
              disabled={activeIndex === 0}
              aria-label="Previous Developer"
              className={`absolute left-0.5 sm:left-1 z-50 p-2 sm:p-2.5 rounded-full border border-[#22d3ee]/30 bg-black/70 backdrop-blur-md text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all active:scale-90 ${
                activeIndex === 0
                  ? "opacity-20 cursor-not-allowed pointer-events-none"
                  : "opacity-90 hover:opacity-100 hover:bg-[#22d3ee]/15 hover:border-[#22d3ee]"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <motion.div
              animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
                mass: 0.8,
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative cursor-pointer w-[clamp(160px,46vw,205px)] h-[clamp(215px,31vh,265px)]"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* 4 Slightly Fanned Cards on Mobile */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-[#22d3ee]/15 bg-[#03060f]/60 shadow-md pointer-events-none"
                style={{
                  transform: "translate(-10%, 2%) rotate(-5.5deg) scale(0.92)",
                  zIndex: 1,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-[#22d3ee]/25 bg-[#03060f]/60 shadow-md pointer-events-none"
                style={{
                  transform: "translate(-5%, 1%) rotate(-2.8deg) scale(0.96)",
                  zIndex: 2,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-[#22d3ee]/25 bg-[#03060f]/60 shadow-md pointer-events-none"
                style={{
                  transform: "translate(5%, 1%) rotate(2.8deg) scale(0.96)",
                  zIndex: 2,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl border border-[#22d3ee]/15 bg-[#03060f]/60 shadow-md pointer-events-none"
                style={{
                  transform: "translate(10%, 2%) rotate(5.5deg) scale(0.92)",
                  zIndex: 1,
                }}
              />

              {/* The Developer Cards in Physical Card Deck Motion */}
              {developers.map((dev, idx) => {
                const offset = idx - activeIndex;
                const cardStyle = getCardStyle(offset, true);

                return (
                  <motion.div
                    key={dev.name}
                    animate={{
                      x: cardStyle.x,
                      y: cardStyle.y,
                      scale: cardStyle.scale,
                      rotateZ: cardStyle.rotateZ,
                      opacity: cardStyle.opacity,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 22,
                      mass: 0.9,
                    }}
                    onClick={() => {
                      if (idx !== activeIndex) {
                        setDirection(idx > activeIndex ? 1 : -1);
                        setActiveIndex(idx);
                      }
                    }}
                    style={{
                      zIndex: cardStyle.zIndex,
                      transformOrigin: "center center",
                    }}
                    className="absolute inset-0 w-full h-full rounded-2xl select-none"
                  >
                    {/* Glow Aura */}
                    <motion.div
                      animate={{ opacity: cardStyle.glowOpacity }}
                      transition={{ duration: 0.35 }}
                      style={{
                        boxShadow:
                          "0 0 22px rgba(34, 211, 238, 0.4), 0 0 50px rgba(34, 211, 238, 0.18), 0 14px 32px rgba(0, 0, 0, 0.9)",
                      }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                    />

                    {/* Card Surface */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-[2px] border-[#22d3ee] bg-neutral-950">
                      <Image
                        src={dev.image}
                        alt={dev.name}
                        fill
                        quality={95}
                        priority={idx === 0}
                        sizes="(max-width: 480px) 210px, 250px"
                        className="object-cover object-top rounded-[14px] select-none"
                      />

                      {/* Tint */}
                      <motion.div
                        animate={{ opacity: cardStyle.overlayOpacity }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 bg-[#030712] pointer-events-none transition-colors"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={goToNext}
              disabled={activeIndex === developers.length - 1}
              aria-label="Next Developer"
              className={`absolute right-0.5 sm:right-1 z-50 p-2 sm:p-2.5 rounded-full border border-[#22d3ee]/30 bg-black/70 backdrop-blur-md text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all active:scale-90 ${
                activeIndex === developers.length - 1
                  ? "opacity-20 cursor-not-allowed pointer-events-none"
                  : "opacity-90 hover:opacity-100 hover:bg-[#22d3ee]/15 hover:border-[#22d3ee]"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* 3. Work / Contribution with Static Visual Anchor & Masked Vertical Reveal (Centered with Balanced Side Spacing) */}
          <div className="relative w-full flex flex-col items-center justify-center shrink-0 px-2 sm:px-3 mt-[20px]">
            <div className="flex items-center justify-center gap-2">
              <span className="w-5 h-[2px] bg-[#22d3ee] inline-block" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[#22d3ee] font-semibold uppercase">
                WORKED ON WEBSITE
              </span>
            </div>

            <div className="relative overflow-hidden w-full h-[120px] sm:h-[130px] mt-1">
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentDev.name}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      y: dir > 0 ? "115%" : "-115%",
                      opacity: 0,
                    }),
                    center: {
                      y: "0%",
                      opacity: 1,
                    },
                    exit: (dir) => ({
                      y: dir > 0 ? "-115%" : "115%",
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-start text-center select-none px-2"
                >
                  <h2 className="text-xs sm:text-sm font-bold text-white leading-tight max-w-[300px] text-center mx-auto">
                    {workTitle}
                  </h2>

                  <p className="mt-1.5 text-[11px] sm:text-xs text-neutral-300 leading-relaxed max-w-[340px] text-center mx-auto">
                    {currentDev.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 4. Social Icons with Masked Vertical Reveal */}
          <div className="relative w-full overflow-hidden h-[34px] sm:h-[38px] flex items-center justify-center shrink-0 mt-1.5">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentDev.name}
                custom={direction}
                variants={{
                  enter: (dir) => ({
                    y: dir > 0 ? "115%" : "-115%",
                    opacity: 0,
                  }),
                  center: {
                    y: "0%",
                    opacity: 1,
                  },
                  exit: (dir) => ({
                    y: dir > 0 ? "-115%" : "115%",
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.5, ease: "easeInOut" },
                }}
                className="absolute inset-0 flex items-center justify-center gap-4 select-none"
              >
                <a
                  href={currentDev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${currentDev.name} GitHub`}
                  className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 active:scale-95"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                <span className="text-neutral-700 text-xs select-none">|</span>

                <a
                  href={currentDev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${currentDev.name} LinkedIn`}
                  className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 active:scale-95"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                <span className="text-neutral-700 text-xs select-none">|</span>

                <a
                  href={`mailto:${currentDev.email}`}
                  aria-label={`${currentDev.name} Email`}
                  className="text-white/80 hover:text-[#22d3ee] transition-colors p-1.5 rounded-lg hover:bg-white/5 active:scale-95"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperEditorialSection;
