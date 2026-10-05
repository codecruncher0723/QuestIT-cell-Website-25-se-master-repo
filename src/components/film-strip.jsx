"use client";

// Next's Imports
import Link from "next/link";
import Image from "next/image";

// React's Imports
import { useRef, useState } from "react";

// App's External Imports
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Mail, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

// Sprocket holes: a rounded hole every 28px, cut in the colour of the page behind the film
const SPROCKETS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect x='8' y='7' width='12' height='14' rx='3' fill='%2307090c'/%3E%3C/svg%3E")`;

const button_class =
  "inline-flex size-7 items-center justify-center rounded-md border border-cyan-400/30 bg-white/[0.03] text-neutral-200 transition hover:border-cyan-400 hover:text-cyan-300";

const FilmStrip = ({ members, label }) => {
  const track_ref = useRef(null);
  const drag_ref = useRef({ active: false, start_x: 0, start_scroll: 0, moved: 0 });
  const [current, setCurrent] = useState(1);

  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name));

  const { scrollXProgress } = useScroll({ container: track_ref });

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

  const sprocket_band = "h-7 w-full bg-[#141414] bg-repeat-x";

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#07090c] py-6">
      <div className="mb-4 flex items-center justify-between px-6">
        <span className="text-[11px] uppercase tracking-[0.4em] text-neutral-400">{label}</span>
        <span className="font-mono text-xs text-neutral-400">
          <span className="text-white">{String(current).padStart(2, "0")}</span>
          {" / "}
          {String(sorted.length).padStart(2, "0")}
        </span>
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
        {/* The film advances in from the right when the dropdown opens */}
        <motion.div
          className="w-max px-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          initial={{ x: 160, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={sprocket_band} style={{ backgroundImage: SPROCKETS }} />

          <div className="flex gap-2 bg-[#141414] px-2">
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
              ) => (
                <div key={name} className="group relative w-52 shrink-0 pt-5 sm:w-60">
                  {/* Frame number, like the markings printed on film edges */}
                  <span className="absolute left-1 top-1 font-mono text-[10px] tracking-widest text-cyan-300/70">
                    {String(index + 1).padStart(2, "0")}A
                  </span>

                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-900">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-cover grayscale-[40%] transition duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
                    />
                    {/* Soft vignette for a developed-film look */}
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]" />
                  </div>

                  <div className="px-1 pb-3 pt-3">
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
                </div>
              )
            )}
          </div>

          <div className={sprocket_band} style={{ backgroundImage: SPROCKETS }} />
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-6">
        {/* Progress line */}
        <div className="h-px flex-1 bg-white/10">
          <motion.div className="h-full origin-left bg-cyan-400" style={{ scaleX: scrollXProgress }} />
        </div>

        <div className="flex gap-2">
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
    </div>
  );
};

export { FilmStrip };
