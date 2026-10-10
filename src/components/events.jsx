"use client";

// Next's Imports
import Link from "next/link";

// React's Imports
import { useId, useRef, useState, useEffect, useMemo } from "react";

// Confetti Import
import confetti from "canvas-confetti";

// Next's Imports
import Image from "next/image";

// App's Internal Imports
import { Button } from "@/components/ui/button";
import useOutsideClick from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

// App's External Imports
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowRight, CalendarRange, ExternalLink, Trophy } from "lucide-react";
import events from "@/constants/events";

// Helper function to parse date and assign academic year
const getAcademicYear = (dateString) => {
  const months = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
  };
  
  const parts = dateString.split(' ');
  const month = months[parts[0]];
  const year = parseInt(parts[1]);
  
  // Academic year runs from June to May
  // June 2025 to May 2026 = 2025-26
  if (month >= 6) {
    return `${year}-${String(year + 1).slice(2)}`;
  } else {
    return `${year - 1}-${String(year).slice(2)}`;
  }
};

// Group events by academic year
const groupEventsByAcademicYear = (events) => {
  const grouped = {};
  
  events.forEach(event => {
    const academicYear = getAcademicYear(event.date);
    if (!grouped[academicYear]) {
      grouped[academicYear] = [];
    }
    grouped[academicYear].push(event);
  });
  
  // Sort events within each academic year by date (newest first)
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  });
  
  return grouped;
};

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      width="24"
      fill="none"
      height="24"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      stroke="currentColor"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const Events = ({ featured = false }) => {
  const id = useId();
  const ref = useRef(null);
  const [active, set_active] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Memoize sorted featured events so we don't mutate imported events array or re-sort every render
  const sortedFeaturedEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, []);

  // Party celebration animation function
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 12000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const words = [
    {
      text: "Featured",
    },
    {
      text: "Events",
    },
    {
      text: "You",
    },
    {
      text: "Love",
      className: "!text-cyan-300",
    },
  ];

  useOutsideClick(ref, () => set_active(null));

  useEffect(() => {
    function on_key_down(event) {
      if (event.key === "Escape") {
        set_active(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      
      // Trigger confetti for GENESIS 2026
      if (active.title === "GENESIS 2026") {
        triggerConfetti();
      }
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", on_key_down);
    return () => window.removeEventListener("keydown", on_key_down);
  }, [active]);

  // Close modal on scroll
  useEffect(() => {
    function on_scroll() {
      if (active && typeof active === "object") {
        set_active(null);
      }
    }

    if (active && typeof active === "object") {
      window.addEventListener("scroll", on_scroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", on_scroll);
    };
  }, [active]);

  // Render featured events (for home page)
  if (featured) {
    return (
      <LayoutGroup>
      <div id="events">
        <TypewriterEffect words={words} className="pt-5 md:pt-10 pb-16" />

        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && typeof active === "object" ? (
            <motion.div
              key="modal-overlay-featured"
              className="fixed inset-0 grid place-items-center z-[11000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                key={`button-${active.title}-${id}`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 z-[11001]"
                onClick={() => set_active(null)}
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                ref={ref}
                layoutId={`event-${active.title}-${id}`}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className={cn(
                  "w-full max-w-[500px] h-full md:h-fit md:max-h-[100%] flex flex-col bg-neutral-900 sm:rounded-3xl overflow-hidden relative",
                  active.title === "GENESIS 2026" && "bg-cyan-600 shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                )}
              >
                <div>
                  <Image
                    priority
                    unoptimized
                    width={200}
                    height={200}
                    src={active.image}
                    alt={active.title}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </div>

                <div>
                  <div className="flex flex-col justify-between items-start p-4 gap-1">
                    <h3
                      className={cn(
                        "font-medium text-neutral-200 text-xl",
                        active.title === "GENESIS 2026" && "text-white"
                      )}
                    >
                      {active.title}
                    </h3>

                    <div className="flex items-center gap-4 w-full">
                      <p
                        className={cn(
                          "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                          active.title === "GENESIS 2026" && "text-white/90"
                        )}
                      >
                        <CalendarRange size={20} className={cn(active.title === "GENESIS 2026" && "text-white")} /> {active.date}
                      </p>

                      {active.website && (
                        active.title === "Vibe W Quest" ? (
                          <Link
                            href="/vibe-w-quest-winners"
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-base"
                          >
                            <Trophy size={16} />
                            <span>Vibe W Quest Winners 🏆</span>
                          </Link>
                        ) : (
                          <Link
                            href={active.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-base",
                              active.title === "GENESIS 2026" && "text-white hover:text-white/80 underline decoration-white/30"
                            )}
                          >
                            <ExternalLink size={16} />
                            <span>{active.title === "GENESIS 2026" ? "Genesis Website" : "Event Website"}</span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>

                  <div className="pt-4 md:pt-2 relative px-4">
                    <div
                      className={cn(
                        "text-base flex-1 h-full max-h-[50vh] md:max-h-[60vh] pb-5 text-ellipsis flex flex-col items-start gap-4 overflow-y-auto text-neutral-400",
                        active.title === "GENESIS 2026" && "text-white/90"
                      )}
                    >
                      {active.description}

                      {active.speakers && active.speakers.length > 0 && (
                        <>
                          <h3
                            className={cn(
                              "font-medium text-neutral-200 text-xl mt-4",
                              active.title === "GENESIS 2026" && "text-white"
                            )}
                          >
                            Speakers
                          </h3>

                          <div className="pt-4 flex flex-row items-center gap-2 w-full">
                            <div className="flex flex-row -space-x-3">
                              <AnimatedTooltip items={active.speakers} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vibe W Quest Special Button (Featured) */}
                  {active.title === "Vibe W Quest" && (
                    <div className="px-4 pb-4">
                      <Link href="/vibe-w-quest-winners">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                          <Trophy size={18} />
                          Vibe W Quest Winners 🏆
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ul className="w-full max-w-none px-4 md:px-10 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
          {sortedFeaturedEvents.map((event, index) => (
              active?.title === event.title ? (
                <motion.div
                  key={index}
                  layoutId={`event-${event.title}-${id}`}
                  className="h-60 w-full"
                />
              ) : (
                <motion.div
                  key={index}
                  onClick={() => set_active(event)}
                  layoutId={`event-${event.title}-${id}`}
                  className={cn(
                    "p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer",
                    event.title === "GENESIS 2026" && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  )}
                >
                  <div className="flex gap-4 flex-col w-full">
                    <div>
                      <Image
                        width={100}
                        unoptimized
                        height={100}
                        src={event.image}
                        alt={event.title}
                        className="h-60 w-full rounded-lg object-cover object-top"
                      />
                    </div>

                    <div className="flex justify-center items-center flex-col gap-1">
                      <h3
                        className={cn(
                          "font-medium text-neutral-200 text-center md:text-left text-xl",
                          event.title === "GENESIS 2026" && "text-white"
                        )}
                      >
                        {event.title}
                      </h3>

                      <p
                        className={cn(
                          "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                          event.title === "GENESIS 2026" && "text-white/90"
                        )}
                      >
                        <CalendarRange size={20} className={cn(event.title === "GENESIS 2026" && "text-white")} /> {event.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
        </ul>

        <div className="flex justify-center items-center mt-8 md:mt-12 mb-12 md:mb-16">
          <Link href="/events">
            <Button className="px-8 py-4 text-lg bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition duration-200 shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Explore More Events <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      </LayoutGroup>
    );
  }

  // Render events grouped by academic year (for events page)
  const groupedEvents = useMemo(() => groupEventsByAcademicYear(events), []);
  const academicYears = useMemo(() => {
    return Object.keys(groupedEvents).sort((a, b) => {
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearB - yearA; // Sort in descending order (newest first)
    });
  }, [groupedEvents]);

  // Track which sections are in view for animation
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observers = [];
    
    academicYears.forEach((year) => {
      const element = document.getElementById(`section-${year}`);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSections((prev) => ({ ...prev, [year]: true }));
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [academicYears]);

  return (
    <LayoutGroup>
    <div id="events">
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <motion.div
            key="modal-overlay-full"
            className="fixed inset-0 grid place-items-center z-[11000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => set_active(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              ref={ref}
              layoutId={`event-${active.title}-${id}`}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={cn(
                "w-full max-w-[500px] h-full md:h-fit md:max-h-[100%] flex flex-col bg-neutral-900 sm:rounded-3xl overflow-hidden relative",
                active.title === "GENESIS 2026" && "bg-cyan-600 shadow-[0_0_40px_rgba(6,182,212,0.6)]"
              )}
            >
              <div>
                <Image
                  priority
                  unoptimized
                  width={200}
                  height={200}
                  src={active.image}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </div>

              <div>
                <div className="flex flex-col justify-between items-start p-4 gap-1">
                  <h3
                    className={cn(
                      "font-medium text-neutral-200 text-xl",
                      active.title === "GENESIS 2026" && "text-white"
                    )}
                  >
                    {active.title}
                  </h3>

                  <div className="flex items-center gap-4 w-full">
                    <p
                      className={cn(
                        "text-neutral-400 text-center md:text-left text-base flex gap-2 items-center",
                        active.title === "GENESIS 2026" && "text-white/90"
                      )}
                    >
                      <CalendarRange size={20} className={cn(active.title === "GENESIS 2026" && "text-white")} /> {active.date}
                    </p>

                    {active.title === "Vibe W Quest" ? (
                      <Link
                        href="/vibe-w-quest-winners"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-base"
                      >
                        <Trophy size={16} />
                        <span>Vibe W Quest Winners 🏆</span>
                      </Link>
                    ) : active.website ? (
                      <Link
                        href={active.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-base",
                          active.title === "GENESIS 2026" && "text-white hover:text-white/80 underline decoration-white/30"
                        )}
                      >
                        <ExternalLink size={16} />
                        <span>{active.title === "GENESIS 2026" ? "Genesis Website" : "Event Website"}</span>
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="pt-4 md:pt-2 relative px-4">
                  <div
                    className={cn(
                      "text-base flex-1 h-full max-h-[50vh] md:max-h-[60vh] pb-5 text-ellipsis flex flex-col items-start gap-4 overflow-y-auto text-neutral-400",
                      active.title === "GENESIS 2026" && "text-white/90"
                    )}
                  >
                    {active.description}

                    {active.speakers && active.speakers.length > 0 && (
                      <>
                        <motion.h3
                          className={cn(
                            "font-medium text-neutral-200 text-xl mt-4",
                            active.title === "GENESIS 2026" && "text-white"
                          )}
                        >
                          Speakers
                        </motion.h3>

                        <div className="pt-4 flex flex-row items-center gap-2 w-full">
                          <div className="flex flex-row -space-x-3">
                            <AnimatedTooltip items={active.speakers} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Vibe W Quest Special Link */}
                {active.title === "Vibe W Quest" && (
                  <div className="px-4 pb-4">
                    <Link href="/vibe-w-quest-winners">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                        <Trophy size={18} />
                        Vibe W Quest Winners 🏆
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Events grouped by academic year */}
      <div className="w-full space-y-12 sm:space-y-14 md:space-y-16">
        {academicYears.map((academicYear, yearIndex) => (
          <div 
            key={academicYear} 
            id={`section-${academicYear}`}
            className="space-y-6 sm:space-y-7 md:space-y-8"
          >
            {/* Academic Year Header */}
            <motion.div 
              className="relative px-4 sm:px-6 md:px-10"
              initial={{ opacity: 0, x: -50 }}
              animate={visibleSections[academicYear] ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-xl font-medium text-white py-4">
                {academicYear}
              </h2>
              <motion.div 
                className="h-[1px] w-full bg-cyan-300"
                initial={{ scaleX: 0 }}
                animate={visibleSections[academicYear] ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              ></motion.div>
            </motion.div>

            {/* Events Grid */}
            <ul className="w-full max-w-none px-4 sm:px-6 md:px-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-3 sm:gap-4">
              {groupedEvents[academicYear].map((event, index) => (
                active?.title === event.title ? (
                  <motion.div
                    key={index}
                    layoutId={`event-${event.title}-${id}`}
                    className="h-48 sm:h-56 md:h-60 w-full"
                  />
                ) : (
                  <motion.div
                    key={index}
                    onClick={() => set_active(event)}
                    layoutId={`event-${event.title}-${id}`}
                    className={cn(
                      "p-3 sm:p-4 flex flex-col hover:bg-neutral-900 rounded-xl cursor-pointer transition-all",
                      event.title === "GENESIS 2026" && "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    )}
                  >
                    <div className="flex gap-3 sm:gap-4 flex-col w-full">
                      <div>
                        <Image
                          width={100}
                          unoptimized
                          height={100}
                          src={event.image}
                          alt={event.title}
                          className="h-48 sm:h-56 md:h-60 w-full rounded-lg object-cover object-top"
                        />
                      </div>

                      <div className="flex justify-center items-center flex-col gap-1">
                        <h3
                          className={cn(
                            "font-medium text-neutral-200 text-center md:text-left text-lg sm:text-xl",
                            event.title === "GENESIS 2026" && "text-white"
                          )}
                        >
                          {event.title}
                        </h3>

                        <p
                          className={cn(
                            "text-neutral-400 text-center md:text-left text-sm sm:text-base flex gap-1.5 sm:gap-2 items-center",
                            event.title === "GENESIS 2026" && "text-white/90"
                          )}
                        >
                          <CalendarRange size={18} className={cn("sm:w-5 sm:h-5", event.title === "GENESIS 2026" && "text-white")} /> {event.date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </LayoutGroup>
  );
};

export { Events };