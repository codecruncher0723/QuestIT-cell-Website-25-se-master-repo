"use client";

// Next's Imports
import Link from "next/link";
import Image from "next/image";

// React's Imports
import { useEffect, useRef, useState } from "react";

// App's External Imports
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

// Cable geometry (px): where the cable starts and how far it sags in the middle
const ROPE_TOP = 14;
const ROPE_SAG = 34;
const cable_path = `M0 ${ROPE_TOP} Q500 ${ROPE_TOP + 2 * ROPE_SAG} 1000 ${ROPE_TOP}`;

// Small fixed tilts so the polaroids look hand-pinned, not random on every render
const TILTS = [-5, 3, -2, 4, -3, 2, -4, 5, -1, 3];

const rope_y = (t) => ROPE_TOP + 4 * ROPE_SAG * t * (1 - t);

const PolaroidClothesline = ({ members }) => {
  const track_ref = useRef(null);
  const [pages, setPages] = useState(1);
  const [active_page, setActivePage] = useState(0);
  const reduce_motion = useReducedMotion();

  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name));

  // Recalculate dots when the track is resized or scrolled
  useEffect(() => {
    const track = track_ref.current;
    if (!track) return;

    const update = () => {
      // clientWidth is 0 while hidden, which would give Infinity pages
      if (!track.clientWidth) return;

      const total = Math.min(20, Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05)));
      setPages(total);

      const max_scroll = track.scrollWidth - track.clientWidth;
      const progress = max_scroll > 0 ? track.scrollLeft / max_scroll : 0;
      setActivePage(Math.round(progress * (total - 1)));
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    const resize_observer = new ResizeObserver(update);
    resize_observer.observe(track);

    return () => {
      track.removeEventListener("scroll", update);
      resize_observer.disconnect();
    };
  }, []);

  const scroll_by_page = (direction) => {
    const track = track_ref.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  const scroll_to_page = (page) => {
    const track = track_ref.current;
    if (!track) return;

    const max_scroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: (max_scroll * page) / Math.max(1, pages - 1), behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-label="Previous members"
        onClick={() => scroll_by_page(-1)}
        className="absolute left-1 top-1/2 z-20 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white disabled:opacity-0"
        disabled={active_page === 0}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Next members"
        onClick={() => scroll_by_page(1)}
        className="absolute right-1 top-1/2 z-20 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white disabled:opacity-0"
        disabled={active_page === pages - 1}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={track_ref}
        className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex w-max items-start gap-12 px-10 pb-10 pt-0 sm:gap-20 sm:px-16">
          {/* Glowing data cable stretches across every card and scrolls with them */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full"
            viewBox="0 0 1000 96"
            preserveAspectRatio="none"
          >
            <path d={cable_path} fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="8" />
            <path d={cable_path} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.7" />
            {!reduce_motion && (
              <motion.path
                d={cable_path}
                fill="none"
                stroke="#a5f3fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.06 0.94"
                animate={{ strokeDashoffset: [1, 0] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              />
            )}
          </svg>

          {sorted.map(
            (
              {
                name,
                image,
                designation,
                email = "questit@ves.ac.in",
                github = "https://github.com/QuestIT-Cell",
                linkedin = "https://www.linkedin.com/company/questit-vesit",
              },
              index
            ) => {
              const tilt = TILTS[index % TILTS.length];
              const hang_at = rope_y((index + 0.5) / sorted.length);

              return (
                <motion.div
                  key={name}
                  className="relative shrink-0 snap-center"
                  style={{ marginTop: hang_at + 23, transformOrigin: "50% -28px" }}
                  initial={{ opacity: 0, y: -40, rotate: tilt * 3 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: tilt,
                    transition: { type: "spring", stiffness: 120, damping: 12, delay: index * 0.08 },
                  }}
                  whileHover={{ rotate: 0, y: 6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                >
                  {/* Glowing node on the cable with a thin wire down to the card */}
                  <div aria-hidden="true" className="absolute left-1/2 -top-7 z-10 flex -translate-x-1/2 flex-col items-center">
                    <span className="size-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
                    <span className="h-5 w-px bg-gradient-to-b from-cyan-300 to-cyan-400/20" />
                  </div>

                  <div className="relative w-44 rounded-xl border border-cyan-400/20 bg-[#0b0f14] p-2 pb-3 shadow-[0_12px_30px_rgba(0,0,0,0.7)] sm:w-52">
                    {/* Light blue corner brackets */}
                    <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px z-10 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-cyan-400" />
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px z-10 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-cyan-400" />

                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-900">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {/* Photo fades into the card */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0f14] to-transparent" />
                    </div>

                    <div className="relative -mt-4 px-1">
                      <h3 className="text-sm font-semibold uppercase leading-tight tracking-wider text-white">
                        {name}
                      </h3>
                      <p className="mt-1 text-[11px] uppercase leading-tight tracking-widest text-neutral-400">
                        {designation}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <Link
                          aria-label={`Email ${name}`}
                          href={`mailto:${email}`}
                          className="inline-flex size-7 items-center justify-center rounded-md border border-cyan-400/30 bg-white/[0.03] text-neutral-200 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Link>
                        <a
                          aria-label={`${name} on LinkedIn`}
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-7 items-center justify-center rounded-md border border-cyan-400/30 bg-white/[0.03] text-neutral-200 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                        <a
                          aria-label={`${name} on GitHub`}
                          href={github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-7 items-center justify-center rounded-md border border-cyan-400/30 bg-white/[0.03] text-neutral-200 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, page) => (
            <button
              key={page}
              type="button"
              aria-label={`Go to page ${page + 1}`}
              onClick={() => scroll_to_page(page)}
              className={`h-1.5 rounded-full transition-all ${
                page === active_page ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { PolaroidClothesline };
