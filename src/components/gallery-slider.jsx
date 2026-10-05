"use client";

// Next's Imports
import Link from "next/link";
import Image from "next/image";

// React's Imports
import { useRef, useState } from "react";

// App's External Imports
import {
  motion,
  useScroll,
  useSpring,
  useVelocity,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Mail, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

// Photos alternate in size and height, like a hand-laid gallery wall
const LAYOUTS = [
  { size: "h-64 w-48 sm:h-80 sm:w-60", offset: "sm:-translate-y-6" },
  { size: "h-52 w-40 sm:h-64 sm:w-48", offset: "sm:translate-y-10" },
  { size: "h-60 w-44 sm:h-72 sm:w-56", offset: "sm:-translate-y-2" },
  { size: "h-56 w-44 sm:h-60 sm:w-48", offset: "sm:translate-y-6" },
];

const button_class =
  "inline-flex size-7 items-center justify-center rounded-md border border-cyan-400/30 bg-white/[0.03] text-neutral-200 transition hover:border-cyan-400 hover:text-cyan-300";

const GallerySlider = ({ members, label }) => {
  const track_ref = useRef(null);
  const drag_ref = useRef({ active: false, start_x: 0, start_scroll: 0, moved: 0 });
  const [current, setCurrent] = useState(1);
  const reduce_motion = useReducedMotion();

  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name));

  // Scroll speed drives the skew and the red/blue colour split
  const { scrollX, scrollXProgress } = useScroll({ container: track_ref });
  const velocity = useSpring(useVelocity(scrollX), { damping: 40, stiffness: 300 });
  const skew = useTransform(velocity, [-2500, 0, 2500], reduce_motion ? [0, 0, 0] : [6, 0, -6], {
    clamp: true,
  });
  const split = useTransform(velocity, [-2500, 0, 2500], reduce_motion ? [0, 0, 0] : [-8, 0, 8], {
    clamp: true,
  });
  const split_opposite = useTransform(split, (value) => -value);
  const colour_split = useMotionTemplate`drop-shadow(${split}px 0 0 rgba(255, 50, 50, 0.7)) drop-shadow(${split_opposite}px 0 0 rgba(40, 200, 255, 0.7))`;

  useMotionValueEvent(scrollXProgress, "change", (progress) => {
    setCurrent(Math.round(progress * (sorted.length - 1)) + 1);
  });

  const scroll_by = (direction) => {
    const track = track_ref.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.6, behavior: "smooth" });
  };

  // Click-and-drag scrolling for mouse users (touch already swipes natively)
  const on_pointer_down = (event) => {
    if (event.pointerType !== "mouse") return;
    drag_ref.current = {
      active: true,
      start_x: event.clientX,
      start_scroll: track_ref.current.scrollLeft,
      moved: 0,
    };
  };

  const on_pointer_move = (event) => {
    const drag = drag_ref.current;
    if (!drag.active) return;
    drag.moved = Math.abs(event.clientX - drag.start_x);
    track_ref.current.scrollLeft = drag.start_scroll - (event.clientX - drag.start_x);
  };

  const on_pointer_up = () => {
    drag_ref.current.active = false;
  };

  // Don't open a link if the user was dragging
  const on_click_capture = (event) => {
    if (drag_ref.current.moved > 6) {
      event.preventDefault();
      event.stopPropagation();
      drag_ref.current.moved = 0;
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#07090c] py-8">
      {/* Progress line */}
      <div className="absolute left-6 right-6 top-4 h-px bg-white/10">
        <motion.div className="h-full origin-left bg-cyan-400" style={{ scaleX: scrollXProgress }} />
      </div>

      <div className="absolute left-6 top-8 z-10 text-[11px] uppercase tracking-[0.4em] text-neutral-400">
        {label}
      </div>

      <div className="absolute right-6 top-8 z-10 font-mono text-xs text-neutral-400">
        <span className="text-white">{String(current).padStart(2, "0")}</span>
        {" / "}
        {String(sorted.length).padStart(2, "0")}
      </div>

      <div
        ref={track_ref}
        onPointerDown={on_pointer_down}
        onPointerMove={on_pointer_move}
        onPointerUp={on_pointer_up}
        onPointerLeave={on_pointer_up}
        onClickCapture={on_click_capture}
        className="relative cursor-grab select-none overflow-x-auto overflow-y-hidden active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max items-center gap-10 px-6 pb-6 pt-16 sm:gap-14 sm:px-16 sm:pt-20">
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
              const layout = LAYOUTS[index % LAYOUTS.length];

              return (
                <div key={name} className={`shrink-0 ${layout.offset}`}>
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(index, 6) * 0.07 }}
                >
                  <motion.div
                    className={`group relative overflow-hidden ${layout.size}`}
                    style={{ skewX: skew, filter: colour_split }}
                  >
                    <Image
                      src={image}
                      alt={name}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </motion.div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{name}</h3>
                    <p className="mt-0.5 text-[11px] uppercase tracking-widest text-neutral-400">
                      {designation}
                    </p>

                    <div className="mt-2 flex gap-2">
                      <Link aria-label={`Email ${name}`} href={`mailto:${email}`} className={button_class}>
                        <Mail className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        aria-label={`${name} on LinkedIn`}
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={button_class}
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                      <a
                        aria-label={`${name} on GitHub`}
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={button_class}
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2 px-6">
        <button
          type="button"
          aria-label="Previous members"
          onClick={() => scroll_by(-1)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next members"
          onClick={() => scroll_by(1)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export { GallerySlider };
