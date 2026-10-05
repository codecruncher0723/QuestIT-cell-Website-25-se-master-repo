"use client";

// Next's Imports
import Link from "next/link";
import Image from "next/image";

// React's Imports
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// App's External Imports
import { useReducedMotion } from "framer-motion";
import { Mail, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";

// Rope geometry (px): where the rope starts and how far it sags in the middle
const ROPE_TOP = 14;
const ROPE_SAG = 34;

// Spotlight timing (ms)
const SPOTLIGHT_EVERY = 3000;
const RESUME_AFTER = 4000;

// Fairy-light bulbs per polaroid along the rope
const BULBS_PER_CARD = 4;

// How far the rope reaches past the first and last polaroid (px, matches -inset-x-12)
const ROPE_OVERHANG = 48;

// Groups bigger than this hang on two ropes that scroll together
const TWO_ROWS_FROM = 10;

const rope_y = (t) => ROPE_TOP + 4 * ROPE_SAG * t * (1 - t);

// Horizontal centre of a polaroid, measured from the visible left edge of the strip
const center_in_track = (track, card) => {
  const card_rect = card.getBoundingClientRect();
  return card_rect.left + card_rect.width / 2 - track.getBoundingClientRect().left;
};

const PolaroidClothesline = ({ members, title, subtitle }) => {
  const track_ref = useRef(null);
  const card_refs = useRef([]);
  const line_refs = useRef([]);
  const resume_timer = useRef(null);
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const reduce_motion = useReducedMotion();

  const sorted = [...members].sort((a, b) => a.name.localeCompare(b.name));
  const total = sorted.length;

  // Fill column by column (top, bottom, top, ...) so the spotlight zig-zags left to right
  const row_count = total > TWO_ROWS_FROM ? 2 : 1;
  const rows = Array.from({ length: row_count }, (_, row) =>
    sorted.map((_, index) => index).filter((index) => index % row_count === row)
  );

  // The spotlight lights a whole column (top and bottom polaroid together)
  const column_count = Math.ceil(total / row_count);
  const column_of = (index) => Math.floor(index / row_count);

  // Where each polaroid's centre falls along the rope (0 = left end, 1 = right end)
  const [rope_positions, setRopePositions] = useState(() =>
    sorted.map((_, index) => (index + 0.5) / sorted.length)
  );

  // Measure the real layout so every pin hangs exactly on the sagging rope
  useLayoutEffect(() => {
    const lines = line_refs.current.filter(Boolean);
    if (!lines.length) return;

    const measure = () => {
      if (!lines[0].offsetWidth) return;

      const positions = card_refs.current.map((card) => {
        if (!card) return 0.5;
        const rope_width = card.offsetParent.offsetWidth + 2 * ROPE_OVERHANG;
        return (card.offsetLeft + card.offsetWidth / 2 + ROPE_OVERHANG) / rope_width;
      });
      setRopePositions((previous) =>
        previous.length === positions.length && previous.every((value, index) => Math.abs(value - positions[index]) < 0.001)
          ? previous
          : positions
      );
    };

    measure();
    const resize_observer = new ResizeObserver(measure);
    lines.forEach((line) => resize_observer.observe(line));
    return () => resize_observer.disconnect();
  }, [total, row_count]);
  const paused = interacting || reduce_motion;

  // Slide the strip so the active column sits in the middle
  useEffect(() => {
    const track = track_ref.current;
    const card = card_refs.current[active * row_count];
    if (!track || !card || !track.clientWidth) return;

    // The first column shows next to the title, the rest are centred
    const left = active === 0 ? 0 : track.scrollLeft + center_in_track(track, card) - track.clientWidth / 2;
    track.scrollTo({ left, behavior: reduce_motion ? "auto" : "smooth" });
  }, [active, reduce_motion, row_count]);

  // Move the spotlight to the next column every few seconds
  useEffect(() => {
    if (paused || column_count < 2) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setActive((current) => (current + 1) % column_count);
    }, SPOTLIGHT_EVERY);

    return () => clearInterval(timer);
  }, [paused, column_count]);

  useEffect(() => () => clearTimeout(resume_timer.current), []);

  // The column closest to the middle of the strip
  const nearest_to_center = () => {
    const track = track_ref.current;
    if (!track) return active;

    const center = track.clientWidth / 2;
    let nearest = 0;
    let nearest_distance = Infinity;
    card_refs.current.forEach((card, index) => {
      if (!card) return;
      const distance = Math.abs(center_in_track(track, card) - center);
      if (distance < nearest_distance) {
        nearest = index;
        nearest_distance = distance;
      }
    });
    return Math.floor(nearest / row_count);
  };

  // Stop the autoplay while someone swipes or scrolls, then pick up from where they left it
  const pause_for_user = useCallback(() => {
    setInteracting(true);
    clearTimeout(resume_timer.current);
    resume_timer.current = setTimeout(() => {
      setActive(nearest_to_center());
      setInteracting(false);
    }, RESUME_AFTER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go_to = (column) => {
    setActive((column + column_count) % column_count);
    pause_for_user();
  };

  // One rope with its fairy lights and polaroids
  const render_row = (indices, row) => (
        <div
          key={row}
          ref={(element) => (line_refs.current[row] = element)}
          className="relative flex w-max max-w-none items-start gap-12 pb-12 pt-4 sm:gap-20"
        >
          {/* The rope stretches across every polaroid and scrolls with them */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 top-4 h-24 w-[calc(100%+6rem)] max-w-none"
            viewBox="0 0 1000 96"
            preserveAspectRatio="none"
          >
            <path
              d={`M0 ${ROPE_TOP} Q500 ${ROPE_TOP + 2 * ROPE_SAG} 1000 ${ROPE_TOP}`}
              fill="none"
              stroke="#b08a5f"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M0 ${ROPE_TOP} Q500 ${ROPE_TOP + 2 * ROPE_SAG} 1000 ${ROPE_TOP}`}
              fill="none"
              stroke="#d9b98c"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Warm white-yellow fairy lights along the rope */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-12 top-4 h-24 max-w-none">
            {Array.from({ length: indices.length * BULBS_PER_CARD }).map((_, index) => {
              const t = (index + 0.5) / (indices.length * BULBS_PER_CARD);
              return (
                <span
                  key={index}
                  className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff7d6] shadow-[0_0_8px_3px_rgba(255,224,130,0.65)] animate-pulse motion-reduce:animate-none"
                  style={{
                    left: `${t * 100}%`,
                    top: rope_y(t),
                    animationDuration: `${2.2 + (index % 5) * 0.4}s`,
                    animationDelay: `${(index % 7) * 0.3}s`,
                  }}
                />
              );
            })}
          </div>

          {indices.map((index) => {
              const {
                name,
                image,
                designation,
                email = "questit@ves.ac.in",
                github = "https://github.com/QuestIT-Cell",
                linkedin = "https://www.linkedin.com/company/questit-vesit",
              } = sorted[index];
              const hang_at = rope_y(rope_positions[index] ?? 0.5);
              const is_active = column_of(index) === active;

              return (
                <div
                  key={name}
                  ref={(element) => (card_refs.current[index] = element)}
                  className={`relative max-w-none shrink-0 snap-center origin-top transition-all duration-700 ease-out motion-reduce:transition-none ${
                    is_active ? "z-20 scale-[1.08]" : "z-0 brightness-[0.55] saturate-[0.8]"
                  }`}
                  style={{ marginTop: hang_at + 10 }}
                  onClick={() => go_to(column_of(index))}
                >
                  {/* Soft warm glow behind the spotlighted polaroid */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-8 -z-10 max-w-none rounded-full bg-[radial-gradient(circle,rgba(255,236,170,0.4),transparent_70%)] blur-xl transition-opacity duration-700 ${
                      is_active ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Brighter bulb right next to the pin of the spotlighted polaroid */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[calc(50%+16px)] -top-2.5 z-20 size-3 -translate-y-1/2 rounded-full bg-[#fffbe8] transition-all duration-700 ${
                      is_active
                        ? "opacity-100 shadow-[0_0_14px_6px_rgba(255,230,150,0.9)]"
                        : "opacity-0"
                    }`}
                  />

                  {/* Wooden clothespin */}
                  <div className="absolute left-1/2 -top-5 z-10 h-10 w-4 max-w-none -translate-x-1/2 rounded-sm bg-gradient-to-b from-[#d8b48a] to-[#a97e52] shadow-md">
                    <div className="mx-auto mt-4 h-px w-3 bg-[#7a5634]" />
                  </div>

                  <div
                    className={`w-44 max-w-none bg-[#efe8dc] p-3 pb-4 transition-shadow duration-700 sm:w-52 ${
                      is_active
                        ? "shadow-[0_18px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(255,230,150,0.25)]"
                        : "shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
                    }`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-800">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <h3 className="mt-3 text-base font-semibold leading-tight text-neutral-900">
                      {name}
                    </h3>
                    <p className="mt-1 text-xs leading-tight text-neutral-600">
                      {designation}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <Link
                        aria-label={`Email ${name}`}
                        href={`mailto:${email}`}
                        className="inline-flex size-7 items-center justify-center rounded-md border border-neutral-400 text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        aria-label={`${name} on GitHub`}
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-7 items-center justify-center rounded-md border border-neutral-400 text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                      <a
                        aria-label={`${name} on LinkedIn`}
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-7 items-center justify-center rounded-md border border-neutral-400 text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
  );

  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-label="Previous members"
        onClick={() => go_to(active - 1)}
        className="absolute left-1 top-1/2 z-30 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Next members"
        onClick={() => go_to(active + 1)}
        className="absolute right-1 top-1/2 z-30 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={track_ref}
        onWheel={(event) => {
          // Only sideways scrolling moves the strip; scrolling the page past it shouldn't pause
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) pause_for_user();
        }}
        onTouchStart={pause_for_user}
        onPointerDown={pause_for_user}
        className="overflow-x-auto overflow-y-hidden snap-x snap-proximity [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative w-max max-w-none px-[calc(50vw-5.5rem)] sm:px-[40vw]">
          {/* Big section title in the space before the first polaroid */}
          <div className="absolute inset-y-0 left-0 hidden w-[40vw] flex-col justify-center pl-8 pr-6 sm:flex sm:pl-16">
            {subtitle && (
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#ffe9a8]/80 sm:text-xs">
                {subtitle}
              </span>
            )}
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          </div>

          <div className="flex max-w-none flex-col">
            {rows.map((indices, row) => render_row(indices, row))}
          </div>
        </div>
      </div>

      {/* One dot per column, the lit one is the spotlighted column */}
      <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-4 sm:gap-2">
        {Array.from({ length: column_count }).map((_, column) => (
          <button
            key={column}
            type="button"
            aria-label={`Show ${sorted
              .filter((_, index) => column_of(index) === column)
              .map(({ name }) => name)
              .join(" and ")}`}
            onClick={() => go_to(column)}
            className={`h-1.5 rounded-full transition-all ${
              column === active ? "w-6 bg-[#ffe9a8] sm:w-8" : "w-2.5 bg-white/30 hover:bg-white/50 sm:w-4"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export { PolaroidClothesline };
