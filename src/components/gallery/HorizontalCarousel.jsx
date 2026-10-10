"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PhotoLightboxModal from "./PhotoLightboxModal";

/* ─── Projector Exhibition Images ──────────────────────────────────────────── */
const PROJECTOR_IMAGES = [
  "/images/gallery-images/projector/DSC04678_1920x1080.png",
  "/images/gallery-images/projector/DSC04689_1920x1080.png",
  "/images/gallery-images/projector/Faculty_grp_photo_1920x1080.png",
  "/images/gallery-images/projector/genesis-explaination_1920x1080.png",
  "/images/gallery-images/projector/genesis1.0_1920x1080.png",
  "/images/gallery-images/projector/genesis_event_1920x1080.png",
  "/images/gallery-images/projector/quest_council_faculty_pic_1920x1080.png",
  "/images/gallery-images/projector/SIH_insider_2_1920x1080.png",
  "/images/gallery-images/projector/sliding_1.jpg",
  "/images/gallery-images/projector/sliding_8.jpeg",
  "/images/gallery-images/projector/vibewquest_participants_1920x1080.png",
  "/images/gallery-images/projector/vibwwquest_participants_1920x1080.png",
];

/* ─── Constants & Configuration ────────────────────────────────────────────── */
const TOTAL = PROJECTOR_IMAGES.length;
const PAUSE_MS = 2150;
const TRANSITION_DURATION = 1.35;
const TRANSITION_EASE = [0.35, 0, 0.25, 1];

/* ─── Intro Animation Stages ────────────────────────────────────────────────
   0 = idle          – room + projector model fully visible; images hidden
   1 = rays-blink    – light rays blink slowly (projector powering on)
                       + image cards do vertical slot-machine roll
   2 = rays-on       – rays fully stable; cards stop; TV scan-line expand starts
   3 = done          – everything visible, carousel runs
──────────────────────────────────────────────────────────────────────────── */
const INTRO_DONE = 3;

const imgSrc = (i) => {
  const index = ((i % TOTAL) + TOTAL) % TOTAL;
  return PROJECTOR_IMAGES[index];
};

const CAPTIONS = [
  { top: "ART\nLIVES\nFOREVER", bot: "THE\nCLASSICS\nREIMAGINED" },
  { top: "INNOVATION\nUNBOUND", bot: "FUTURE\nFORWARD" },
  { top: "CULTURE\nIN MOTION", bot: "BREAKING\nBOUNDARIES" },
  { top: "DIGITAL\nFRONTIER", bot: "QUEST IT\nCELL" },
  { top: "CREATIVE\nCODE", bot: "TECH MEETS\nART" },
  { top: "BEYOND\nLIMITS", bot: "SHAPE THE\nFUTURE" },
  { top: "IDEAS THAT\nMATTER", bot: "COMMUNITY\nDRIVEN" },
  { top: "PIXELS &\nPURPOSE", bot: "DESIGN FOR\nIMPACT" },
  { top: "DATA IS\nBEAUTY", bot: "VISUALISE\nTHINK" },
  { top: "BUILD FOR\nTOMORROW", bot: "ENGINEERS\nOF CHANGE" },
  { top: "CONNECT\nCREATE", bot: "ONE TEAM\nONE VISION" },
  { top: "QUEST IT\nCELL", bot: "BUILDING THE\nNEXT CHAPTER" },
];

const HorizontalCarousel = () => {
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);
  const [stageWidth, setStageWidth] = useState(1200);
  const [stageHeight, setStageHeight] = useState(700);
  const [activeModalPhoto, setActiveModalPhoto] = useState(null);

  /* ── Intro animation state ─────────────────────────────────────────────── */
  const [introStage, setIntroStage] = useState(0);
  const introDoneRef = useRef(false);
  const introTimersRef = useRef([]);
  const [raysVisible, setRaysVisible] = useState(false); // controls ray blink
  const [isSlotSpinning, setIsSlotSpinning] = useState(false); // vertical roll on cards
  const [slotIndex, setSlotIndex] = useState(0);            // which image slot shows
  const [isTvExpanding, setIsTvExpanding] = useState(false);// TV scan-line expand on center
  const [isSideTvExpanding, setIsSideTvExpanding] = useState(false); // TV scan-line expand on side walls
  // compat aliases
  const isSpinning = false;
  const activePage = page;

  /* ── Track section client width/height for 100% pixel-perfect corner alignment ── */
  useEffect(() => {
    if (!sectionRef.current) return;
    const update = () => {
      if (sectionRef.current) {
        setStageWidth(sectionRef.current.clientWidth);
        setStageHeight(sectionRef.current.clientHeight);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Responsive breakpoint ──────────────────────────────────────────────── */
  const isVertical = stageWidth < 920;

  /* ── Exact room corner alignment matching SVG viewBox (280/1000 and 720/1000) ── */
  const W = stageWidth;
  const H = stageHeight;
  const leftSeam = Math.round(W * 0.28);
  const rightSeam = Math.round(W * 0.72);
  const midWidth = rightSeam - leftSeam;
  const leftWidth = leftSeam;
  const rightWidth = W - rightSeam;

  // Spacing between cards: set to 43% of section width so images never overlap the corner crease lines
  const spacingPx = Math.round(W * 0.43);
  const cardWidthPx = Math.min(Math.round(W * 0.32), 460);

  /* ── Vertical carousel seams (top/bottom wall boundaries) ──────────────── */
  // Top wall: 0% → 27%  |  Middle wall: 27% → 73%  |  Bottom wall: 73% → 100%
  const vTopSeam    = Math.round(H * 0.27);
  const vBottomSeam = Math.round(H * 0.73);
  const vMidHeight  = vBottomSeam - vTopSeam;
  const vTopHeight  = vTopSeam;
  const vBotHeight  = H - vBottomSeam;
  // Card dimensions: 70% width fits elegantly inside back wall with side margins
  const vCardW = Math.min(Math.round(W * 0.70), 420);
  const vCardH = Math.min(Math.round(vMidHeight * 0.80), 300);
  // Spacing = distance between card centres
  const vSpacingPx = Math.round(H * 0.44);

  /* ── Touch / swipe handling for mobile / desktop ────────────────────────── */
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (isVertical) {
      if (Math.abs(deltaY) > 40) {
        skipIntro();
        if (deltaY < 0) {
          setPage((p) => p + 1);
        } else {
          setPage((p) => p - 1);
        }
        startTimer();
      }
    } else {
      if (Math.abs(deltaX) > 40) {
        skipIntro();
        if (deltaX < 0) {
          setPage((p) => p + 1);
        } else {
          setPage((p) => p - 1);
        }
        startTimer();
      }
    }
  };

  /* ── Auto-advance carousel with 3-second center pause ─────────────────────── */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPage((prev) => prev + 1);
    }, PAUSE_MS + TRANSITION_DURATION * 1000);
  }, []);

  /* ── Skip intro ─────────────────────────────────────────────────────────── */
  const skipIntro = useCallback(() => {
    if (introDoneRef.current) return;
    introDoneRef.current = true;
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setRaysVisible(true);
    setIsSlotSpinning(false);
    setIsTvExpanding(false);
    setIsSideTvExpanding(false);
    setIntroStage(INTRO_DONE);
    setPage(0);
    startTimer();
  }, [startTimer]);

  /* ── Intro sequence ──────────────────────────────────────────────────────── */
  const playIntro = useCallback(() => {
    if (introDoneRef.current) return;

    const push = (fn, delay) => {
      const id = setTimeout(fn, delay);
      introTimersRef.current.push(id);
    };

    // Stage 0: room + projector visible (default), walls clean/unlit, rays off
    // Stage 1: exactly 4 slow mechanical ray blinks + slot-roll on projector cassettes
    push(() => {
      setIntroStage(1);
      setIsSlotSpinning(true);

      // Exactly 4 blinks, then final stable-on
      // Blink 1: 0ms - 200ms
      // Blink 2: 380ms - 580ms
      // Blink 3: 800ms - 1000ms
      // Blink 4: 1250ms - 1450ms
      // Stable ON: 1750ms
      const blinks = [
        [0,    true ],
        [200,  false],
        [380,  true ],
        [580,  false],
        [800,  true ],
        [1000, false],
        [1250, true ],
        [1450, false],
        [1750, true ],  // final stable-on
      ];
      blinks.forEach(([t, vis]) => push(() => setRaysVisible(vis), t));

      // Fast vertical slot roll on the 3 projector cassette cards during the 4 blinks
      const slotDelays = [
        0, 60, 120, 180, 240, 300, 360, 420, 480, 550, 630, 720, 820, 930, 1060, 1200, 1360, 1550
      ];
      slotDelays.forEach((d, i) => push(() => setSlotIndex(i % TOTAL), d));
    }, 0);

    // Stage 2: rays stable + TV scan-line expand on the back wall
    push(() => {
      setIntroStage(2);
      setIsSlotSpinning(false);
      setSlotIndex(0);
      setIsTvExpanding(true);
    }, 1800);

    // Side walls TV scan-line expand: side wall images expand from the middle
    push(() => {
      setIsSideTvExpanding(true);
    }, 2050);

    // Stage 3: done — hand off to carousel after TV expand finishes
    push(() => {
      introDoneRef.current = true;
      setIsTvExpanding(false);
      setIsSideTvExpanding(false);
      setIntroStage(INTRO_DONE);
      setPage(0);
      startTimer();
    }, 2950);
  }, [startTimer]);

  /* ── IntersectionObserver: fire intro once when gallery enters viewport ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !introDoneRef.current) {
          io.disconnect();
          playIntro();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(section);
    return () => {
      io.disconnect();
      introTimersRef.current.forEach(clearTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playIntro]);

  // Auto-carousel only starts after intro completes (handled in playIntro)
  // We still need the startTimer cleanup:
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ── Lightbox Modal for Active Photo (Max View with Cross Symbol) ────────── */
  const handleActivePhotoClick = useCallback((slideIdx) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveModalPhoto({
      src: imgSrc(slideIdx),
      title: `PROJECTOR EXHIBIT ${String(slideIdx + 1).padStart(2, "0")}`,
      alt: `Projector Exhibit Slide ${slideIdx + 1}`,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModalPhoto(null);
    startTimer();
  }, [startTimer]);

  /* ── Direct navigation (cassettes, dials, dots, side walls) ──────────────── */
  const goTo = useCallback(
    (targetIdx) => {
      setPage((prev) => {
        const cur = ((prev % TOTAL) + TOTAL) % TOTAL;
        let delta = ((((targetIdx - cur) % TOTAL) + TOTAL * 1.5) % TOTAL) - TOTAL * 0.5;
        return prev + Math.round(delta);
      });
      startTimer();
    },
    [startTimer]
  );

  /* ── Keyboard navigation ─────────────────────────────────────────────────── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") {
        setPage((p) => p - 1);
        startTimer();
      }
      if (e.key === "ArrowRight") {
        setPage((p) => p + 1);
        startTimer();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startTimer]);

  const currentIndex = ((page % TOTAL) + TOTAL) % TOTAL;
  const prevIndex = (currentIndex - 1 + TOTAL) % TOTAL;
  const nextIndex = (currentIndex + 1) % TOTAL;
  const cap = CAPTIONS[currentIndex] || CAPTIONS[0];

  /* ── Derived intro visibility flags ─────────────────────────────────────── */
  const introComplete  = introStage >= INTRO_DONE;
  const showRays       = introComplete || raysVisible;
  const contentVisible = introComplete;
  const projVisible    = true;            // projector always visible
  const chromeVisible  = contentVisible;
  const centerVisible  = contentVisible;
  // Calculate index for position p (slot-spinning on all 3 cards during intro stage 1)
  const getCardIndex = (p) => {
    if (!introComplete && isSlotSpinning) {
      return (((p - activePage + slotIndex) % TOTAL) + TOTAL) % TOTAL;
    }
    return ((p % TOTAL) + TOTAL) % TOTAL;
  };
  const displayIndex     = (!introComplete && isSlotSpinning) ? slotIndex : currentIndex;
  const displayPrevIndex = (!introComplete && isSlotSpinning) ? (((slotIndex - 1) % TOTAL + TOTAL) % TOTAL) : prevIndex;
  const displayNextIndex = (!introComplete && isSlotSpinning) ? ((slotIndex + 1) % TOTAL) : nextIndex;

  /* ── Continuous visible track positions ─────────────────────────────────── */
  const visiblePositions = [-3, -2, -1, 0, 1, 2, 3].map((off) => activePage + off);

  /* ── Card Content for Middle Wall Viewport ──────────────────────────────── */
  const renderMiddleCard = (slideIdx, isCenter) => (
    <div
      className={`relative w-full h-full overflow-hidden rounded-[3px] select-none${isCenter && isTvExpanding ? ' tv-power-on' : ''}`}
      style={{
        boxShadow: isCenter
          ? "0 0 55px rgba(47,107,255,0.55), 0 0 120px rgba(47,107,255,0.3), inset 0 0 30px rgba(0,0,0,0.6)"
          : "inset 0 0 25px rgba(0,0,0,0.7)",
        WebkitMaskImage: isCenter
          ? "radial-gradient(ellipse 96% 96% at 50% 50%, black 82%, rgba(0,0,0,0.7) 93%, transparent 100%)"
          : "none",
        maskImage: isCenter
          ? "radial-gradient(ellipse 96% 96% at 50% 50%, black 82%, rgba(0,0,0,0.7) 93%, transparent 100%)"
          : "none",
        /* No images reflect on walls before stage 2 (TV power-on) */
        opacity: (!introComplete && introStage < 2) ? 0 : 1,
        transition: introStage <= 1 ? 'none' : 'opacity 0.4s',
      }}
    >
      <Image
        src={imgSrc(slideIdx)}
        alt={`Slide ${slideIdx + 1}`}
        fill
        className="object-cover"
        sizes="480px"
        quality={80}
        priority={isCenter}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isCenter
            ? "linear-gradient(135deg, rgba(47,107,255,0.3) 0%, rgba(76,255,138,0.15) 100%)"
            : "linear-gradient(135deg, rgba(47,107,255,0.2) 0%, rgba(76,255,138,0.1) 100%)",
          mixBlendMode: "color",
        }}
      />
      {isCenter && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
          }}
        />
      )}
    </div>
  );

  /* ── Card Content for Side Wall Viewports (Left & Right) ─────────────────── */
  const renderSideCard = (slideIdx, side) => (
    <div
      className={`relative w-full h-full overflow-hidden rounded-[3px] select-none${isSideTvExpanding ? ' tv-power-on' : ''}`}
      style={{
        filter: "brightness(0.68) contrast(120%) grayscale(25%)",
        boxShadow:
          side === "left"
            ? "inset 0 0 35px rgba(0,0,0,0.9), -8px 0 25px rgba(0,0,0,0.85)"
            : "inset 0 0 35px rgba(0,0,0,0.9), 8px 0 25px rgba(0,0,0,0.85)",
        borderLeft: side === "left" ? "1px solid rgba(34, 211, 238, 0.55)" : "none",
        borderRight: side === "right" ? "1px solid rgba(34, 211, 238, 0.55)" : "none",
        /* Hidden until TV power-on or intro complete */
        opacity: (!introComplete && !isSideTvExpanding) ? 0 : 1,
        transition: introStage <= 1 ? 'none' : 'opacity 0.4s',
      }}
    >
      <Image
        src={imgSrc(slideIdx)}
        alt=""
        fill
        className="object-cover"
        sizes="480px"
        quality={75}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(47,107,255,0.4) 0%, rgba(76,255,138,0.15) 100%)",
          mixBlendMode: "color",
        }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none z-20 ${
          side === "left"
            ? "bg-gradient-to-r from-transparent via-black/15 to-black/85"
            : "bg-gradient-to-l from-transparent via-black/15 to-black/85"
        }`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-black/60 via-transparent to-black/75"
      />
    </div>
  );

  /* ── Card Content for Vertical Top/Bottom Wall Viewports ──────────────── */
  const renderTopCard = (slideIdx) => (
    <div
      className={`relative w-full h-full overflow-hidden rounded-[3px] select-none${isSideTvExpanding ? ' tv-power-on' : ''}`}
      style={{
        filter: "brightness(0.62) contrast(120%) grayscale(30%)",
        boxShadow: "inset 0 0 35px rgba(0,0,0,0.9), 0 -8px 25px rgba(0,0,0,0.85)",
        borderBottom: "1.5px solid rgba(34, 211, 238, 0.55)",
        opacity: (!introComplete && !isSideTvExpanding) ? 0 : 1,
        transition: introStage <= 1 ? 'none' : 'opacity 0.4s',
      }}
    >
      <Image src={imgSrc(slideIdx)} alt="" fill className="object-cover" sizes="480px" quality={75} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "linear-gradient(135deg, rgba(47,107,255,0.4) 0%, rgba(76,255,138,0.15) 100%)", mixBlendMode: "color" }}
      />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-black/85 via-black/20 to-transparent" />
    </div>
  );

  const renderBottomCard = (slideIdx) => (
    <div
      className={`relative w-full h-full overflow-hidden rounded-[3px] select-none${isSideTvExpanding ? ' tv-power-on' : ''}`}
      style={{
        filter: "brightness(0.62) contrast(120%) grayscale(30%)",
        boxShadow: "inset 0 0 35px rgba(0,0,0,0.9), 0 8px 25px rgba(0,0,0,0.85)",
        borderTop: "1.5px solid rgba(34, 211, 238, 0.55)",
        opacity: (!introComplete && !isSideTvExpanding) ? 0 : 1,
        transition: introStage <= 1 ? 'none' : 'opacity 0.4s',
      }}
    >
      <Image src={imgSrc(slideIdx)} alt="" fill className="object-cover" sizes="480px" quality={75} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "linear-gradient(135deg, rgba(47,107,255,0.4) 0%, rgba(76,255,138,0.15) 100%)", mixBlendMode: "color" }}
      />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#02060f] overflow-hidden select-none"
      style={{
        height: isVertical ? "100dvh" : "100vh",
        minHeight: isVertical ? "560px" : "700px",
        paddingTop: isVertical ? "0px" : "110px",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        .font-bebas { font-family: 'Bebas Neue', 'Oswald', sans-serif; }
        .font-mono-tech { font-family: 'Space Mono', monospace; }

        @keyframes reveal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rays-settle {
          0%   { opacity: 0.2; filter: blur(10px) brightness(3); }
          40%  { opacity: 0.85; filter: blur(3px) brightness(1.8); }
          100% { opacity: 1; filter: blur(0px) brightness(1); }
        }
        /* TV power-on: image expands from a thin horizontal line in the center */
        @keyframes tv-power-on {
          0%   { clip-path: inset(49.5% 0 49.5% 0); filter: brightness(2) saturate(0); }
          20%  { clip-path: inset(40% 0 40% 0);   filter: brightness(1.8) saturate(0.2); }
          55%  { clip-path: inset(15% 0 15% 0);   filter: brightness(1.3) saturate(0.7); }
          100% { clip-path: inset(0% 0 0% 0);     filter: brightness(1) saturate(1); }
        }
        /* TV power-on VERTICAL: image expands from a thin vertical line in the center */
        @keyframes tv-power-on-v {
          0%   { clip-path: inset(0 49.5% 0 49.5%); filter: brightness(2) saturate(0); }
          20%  { clip-path: inset(0 40% 0 40%);     filter: brightness(1.8) saturate(0.2); }
          55%  { clip-path: inset(0 15% 0 15%);     filter: brightness(1.3) saturate(0.7); }
          100% { clip-path: inset(0 0% 0 0%);       filter: brightness(1) saturate(1); }
        }
        /* Vertical slot spin: card rolls up fast (used as animation on card wrapper) */
        @keyframes slot-roll {
          0%   { transform: translateY(0%); opacity: 1; }
          45%  { transform: translateY(-100%); opacity: 0; }
          46%  { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0%); opacity: 1; }
        }
        .tv-power-on   { animation: tv-power-on   0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tv-power-on-v { animation: tv-power-on-v 0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
        .rays-settle   { animation: rays-settle 0.6s ease-out forwards; }
      `}</style>

      {/* ── Skip intro button (visible during intro only) ─────────────────── */}
      <AnimatePresence>
        {!introComplete && introStage > 0 && (
          <motion.button
            key="skip-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={skipIntro}
            className="absolute top-4 right-6 z-50 font-mono-tech text-[10px] tracking-[0.3em] uppercase text-[#e8f0ff]/50 hover:text-[#4cff8a] transition-colors duration-200 pointer-events-auto border border-white/10 hover:border-[#4cff8a]/40 px-3 py-1.5 rounded"
          >
            SKIP INTRO ›
          </motion.button>
        )}
      </AnimatePresence>

      {/* No black overlay: room + projector always visible from the start */}


      {/* ══════════════════════════════════════════════════════════════════════
          3D ROOM BACKGROUND (Wireframe & Perspective Gradients)
          Left Corner Seam: x = 280 (28%)
          Right Corner Seam: x = 720 (72%)
      ══════════════════════════════════════════════════════════════════════ */}
      {!isVertical && (
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ex-lwall" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#01030e" />
            <stop offset="100%" stopColor="#051124" />
          </linearGradient>
          <linearGradient id="ex-rwall" x1="720" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#051124" />
            <stop offset="100%" stopColor="#01030e" />
          </linearGradient>
          <linearGradient id="ex-ceil" x1="0" y1="0" x2="0" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#01020a" />
            <stop offset="100%" stopColor="#040b1a" />
          </linearGradient>
          <linearGradient id="ex-floor" x1="0" y1="465" x2="0" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050e1e" />
            <stop offset="100%" stopColor="#010308" />
          </linearGradient>
          <radialGradient id="ex-backwall" cx="500" cy="265" r="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d2146" />
            <stop offset="45%" stopColor="#051124" />
            <stop offset="100%" stopColor="#020712" />
          </radialGradient>
          <radialGradient id="pedestal-floor-glow" cx="500" cy="535" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#122c5e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#01040a" stopOpacity="0" />
          </radialGradient>
          <clipPath id="ex-floor-clip">
            <polygon points="0,600 1000,600 720,465 280,465" />
          </clipPath>
        </defs>

        {/* Room Base */}
        <rect width="1000" height="600" fill="#02060f" />
        {/* Ceiling */}
        <polygon points="0,0 1000,0 720,65 280,65" fill="url(#ex-ceil)" />
        {/* Left Wall */}
        <polygon points="0,0 280,65 280,465 0,600" fill="url(#ex-lwall)" />
        {/* Right Wall */}
        <polygon points="1000,0 1000,600 720,465 720,65" fill="url(#ex-rwall)" />
        {/* Floor */}
        <polygon points="0,600 1000,600 720,465 280,465" fill="url(#ex-floor)" />
        <polygon points="0,600 1000,600 720,465 280,465" fill="url(#pedestal-floor-glow)" />
        {/* Back Wall */}
        <rect x="280" y="65" width="440" height="400" fill="url(#ex-backwall)" />

        {/* Room Perimeter Wireframe Lines (Matching #22d3ee quote font color) */}
        <line x1="0" y1="0" x2="280" y2="65" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
        <line x1="1000" y1="0" x2="720" y2="65" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
        <line x1="0" y1="600" x2="280" y2="465" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
        <line x1="1000" y1="600" x2="720" y2="465" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
        <rect x="280" y="65" width="440" height="400" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.55" />
        <line x1="280" y1="65" x2="720" y2="65" stroke="#22d3ee" strokeWidth="1.4" opacity="0.75" />
      </svg>
      )}

      {/* ── Section Title / Middle Wall Branding (Desktop only; on mobile top-left HUD is used) ── */}
      {!isVertical && (
      <div
        className="absolute top-[96px] left-1/2 -translate-x-1/2 z-30 select-none text-center pointer-events-none flex flex-col items-center"
        style={{
          opacity: introComplete || chromeVisible ? 1 : 0,
          transition: chromeVisible && !introComplete ? 'opacity 0.4s ease-out' : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-[2px] w-6 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #4cff8a)",
              boxShadow: "0 0 8px rgba(76,255,138,0.6)",
            }}
          />
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-[34px] leading-none tracking-[0.14em] uppercase text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
            OUR MEMORIES
          </h2>
          <div
            className="h-[2px] w-6 rounded-full"
            style={{
              background: "linear-gradient(90deg, #4cff8a, transparent)",
              boxShadow: "0 0 8px rgba(76,255,138,0.6)",
            }}
          />
        </div>
      </div>
      )}
      <div
        className="absolute bottom-8 right-8 md:right-12 z-20 hidden md:flex flex-col items-end gap-1 font-mono-tech select-none"
        style={{ opacity: introComplete || chromeVisible ? 1 : 0, transition: 'opacity 0.4s ease-out' }}
      >
        {["ART", "CULTURE", "TECHNOLOGY"].map((l) => (
          <span key={l} className="text-[8.5px] tracking-[0.3em] text-[#e8f0ff]/50 uppercase">{l}</span>
        ))}
        <div className="w-5 h-[1.5px] bg-[#4cff8a] mt-0.5 opacity-80" />
      </div>

      {/* ── Intro chrome wrapper: title + corner labels fade in at stage 5 ── */}
      {!introComplete && introStage > 0 && introStage < 5 && (
        <div className="absolute inset-0 z-30 pointer-events-none" style={{ background: 'transparent' }} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VERTICAL CAROUSEL (< 920px) — 3D Room: Top / Middle / Bottom walls
      ══════════════════════════════════════════════════════════════════════ */}
      {isVertical && (
        <>
          {/* Vertical room wireframe SVG background */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 1000"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Top ceiling panel gradient */}
              <linearGradient id="v-ceil" x1="0" y1="0" x2="0" y2="270" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#01020a" />
                <stop offset="100%" stopColor="#040b1a" />
              </linearGradient>
              {/* Bottom floor panel gradient */}
              <linearGradient id="v-floor" x1="0" y1="730" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#050e1e" />
                <stop offset="100%" stopColor="#010308" />
              </linearGradient>
              {/* Left side wall */}
              <linearGradient id="v-lwall" x1="0" y1="0" x2="65" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#01030e" />
                <stop offset="100%" stopColor="#051124" />
              </linearGradient>
              {/* Right side wall */}
              <linearGradient id="v-rwall" x1="535" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#051124" />
                <stop offset="100%" stopColor="#01030e" />
              </linearGradient>
              {/* Back wall */}
              <radialGradient id="v-back" cx="300" cy="500" r="280" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d2146" />
                <stop offset="45%" stopColor="#051124" />
                <stop offset="100%" stopColor="#020712" />
              </radialGradient>
              <clipPath id="v-top-clip">
                <polygon points="0,0 600,0 535,270 65,270" />
              </clipPath>
              <clipPath id="v-bot-clip">
                <polygon points="0,1000 600,1000 535,730 65,730" />
              </clipPath>
            </defs>

            {/* Room base */}
            <rect width="600" height="1000" fill="#02060f" />
            {/* Back wall */}
            <rect x="65" y="270" width="470" height="460" fill="url(#v-back)" />
            {/* Top ceiling panel */}
            <polygon points="0,0 600,0 535,270 65,270" fill="url(#v-ceil)" />
            {/* Bottom floor panel */}
            <polygon points="0,1000 600,1000 535,730 65,730" fill="url(#v-floor)" />
            {/* Left side strip */}
            <polygon points="0,0 65,270 65,730 0,1000" fill="url(#v-lwall)" />
            {/* Right side strip */}
            <polygon points="600,0 600,1000 535,730 535,270" fill="url(#v-rwall)" />

            {/* Room perimeter wireframe (#22d3ee matching quote font color) */}
            <line x1="0" y1="0" x2="65" y2="270" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
            <line x1="600" y1="0" x2="535" y2="270" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
            <line x1="0" y1="1000" x2="65" y2="730" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
            <line x1="600" y1="1000" x2="535" y2="730" stroke="#22d3ee" strokeWidth="1.2" opacity="0.65" />
            {/* Back-wall rect outline */}
            <rect x="65" y="270" width="470" height="460" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.55" />
            {/* Top/bottom back-wall edge glow */}
            <line x1="65" y1="270" x2="535" y2="270" stroke="#22d3ee" strokeWidth="1.4" opacity="0.75" />
            <line x1="65" y1="730" x2="535" y2="730" stroke="#22d3ee" strokeWidth="1.4" opacity="0.75" />
          </svg>

          {/* ── 3-panel carousel stage ───────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% 50%",
              zIndex: 10,
            }}
          >
            {/* TOP WALL — angled backward (rotateX -55deg, hinged at bottom of panel) */}
            <div
              className="absolute left-0 right-0 overflow-hidden cursor-pointer"
              style={{
                top: 0,
                height: `${vTopHeight}px`,
                transformOrigin: "center bottom",
                transform: "rotateX(-55deg)",
                pointerEvents: "auto",
                opacity: introComplete || isSideTvExpanding ? 1 : 0,
                transition: introComplete ? 'opacity 0.6s ease-out' : undefined,
              }}
              onClick={() => { skipIntro(); setPage((p) => p - 1); startTimer(); }}
            >
              <motion.div
                animate={{ y: -activePage * vSpacingPx }}
                transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
                style={{ position: "absolute", left: 0, top: 0, width: "100%", height: `${H}px` }}
              >
                {visiblePositions.map((p) => {
                  const slideIdx = getCardIndex(p);
                  return (
                    <div key={p} style={{
                      position: "absolute",
                      left: "50%",
                      top: `${Math.round(H * 0.5 + p * vSpacingPx)}px`,
                      transform: "translate(-50%, -50%)",
                      width: `${vCardW}px`,
                      height: `${vCardH}px`,
                    }}>
                      {renderTopCard(slideIdx)}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* MIDDLE WALL — flat, back wall, main image */}
            <div
              className="absolute left-0 right-0 overflow-hidden"
              style={{
                top: `${vTopSeam}px`,
                height: `${vMidHeight}px`,
                pointerEvents: "auto",
              }}
            >
              <motion.div
                animate={{ y: -activePage * vSpacingPx }}
                transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
                style={{ position: "absolute", left: 0, top: `-${vTopSeam}px`, width: "100%", height: `${H}px` }}
              >
                {visiblePositions.map((p) => {
                  const slideIdx = getCardIndex(p);
                  const isCenter = p === activePage;
                  return (
                    <div
                      key={p}
                      onClick={(e) => {
                        e.stopPropagation();
                        skipIntro();
                        if (p !== page) {
                          setPage(p);
                          startTimer();
                        } else {
                          handleActivePhotoClick(slideIdx);
                        }
                      }}
                      title={isCenter ? "Click to maximize photo in full window" : undefined}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: `${Math.round(H * 0.5 + p * vSpacingPx)}px`,
                        transform: "translate(-50%, -50%)",
                        width: `${vCardW}px`,
                        height: `${vCardH}px`,
                        cursor: isCenter ? "zoom-in" : "pointer",
                      }}
                    >
                      {renderMiddleCard(slideIdx, isCenter)}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* BOTTOM WALL — angled backward (rotateX +55deg, hinged at top of panel) */}
            <div
              className="absolute left-0 right-0 overflow-hidden cursor-pointer"
              style={{
                top: `${vBottomSeam}px`,
                height: `${vBotHeight}px`,
                transformOrigin: "center top",
                transform: "rotateX(55deg)",
                pointerEvents: "auto",
                opacity: introComplete || isSideTvExpanding ? 1 : 0,
                transition: introComplete ? 'opacity 0.6s ease-out' : undefined,
              }}
              onClick={() => { skipIntro(); setPage((p) => p + 1); startTimer(); }}
            >
              <motion.div
                animate={{ y: -activePage * vSpacingPx }}
                transition={{ duration: TRANSITION_DURATION, ease: TRANSITION_EASE }}
                style={{ position: "absolute", left: 0, top: `-${vBottomSeam}px`, width: "100%", height: `${H}px` }}
              >
                {visiblePositions.map((p) => {
                  const slideIdx = getCardIndex(p);
                  return (
                    <div key={p} style={{
                      position: "absolute",
                      left: "50%",
                      top: `${Math.round(H * 0.5 + p * vSpacingPx)}px`,
                      transform: "translate(-50%, -50%)",
                      width: `${vCardW}px`,
                      height: `${vCardH}px`,
                    }}>
                      {renderBottomCard(slideIdx)}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Top seam crease line */}
            <div aria-hidden="true" className="absolute left-0 right-0 pointer-events-none z-30" style={{
              top: `${vTopSeam}px`, height: "1.5px",
              background: "linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 10%, #22d3ee 50%, rgba(34, 211, 238, 0.3) 90%, transparent 100%)",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)",
            }} />
            {/* Bottom seam crease line */}
            <div aria-hidden="true" className="absolute left-0 right-0 pointer-events-none z-30" style={{
              top: `${vBottomSeam}px`, height: "1.5px",
              background: "linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 10%, #22d3ee 50%, rgba(34, 211, 238, 0.3) 90%, transparent 100%)",
              boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)",
            }} />
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3D DYNAMIC 3-WALL HORIZONTAL SLIDING STAGE
          Cards physically slide across the three walls without fading or popping.
          Whenever a card crosses a corner crease, the portion on the side wall is
          angled in perspective, and the portion on the middle wall is flat.
          Corner crease positions are 100% mathematically locked to room wireframe.
      ══════════════════════════════════════════════════════════════════════ */}
      {!isVertical && (
      <div
        className="absolute left-0 pointer-events-none"
        style={{
          top: "175px",
          width: `${W}px`,
          height: "min(36vh, 340px)",
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          zIndex: 10,
          /* Whole stage is always active; cards control their own intro reveals */
          opacity: 1,
        }}
      >
        {/* ── 1. LEFT WALL VIEWPORT (0 to leftSeam, angled at rotateY(52deg)) ── */}
        <div
          className="absolute top-0 bottom-0 overflow-hidden cursor-pointer"
          style={{
            left: 0,
            width: `${leftWidth}px`,
            transformOrigin: "right center",
            transform: "rotateY(52deg)",
            transformStyle: "flat",
            pointerEvents: "auto",
            /* Side walls appear with TV expand or once intro sequence completes */
            opacity: introComplete || isSideTvExpanding ? 1 : 0,
            transition: introComplete ? 'opacity 0.6s ease-out' : undefined,
          }}
          onClick={() => {
            skipIntro();
            setPage((p) => p - 1);
            startTimer();
          }}
        >
          <motion.div
            animate={{ x: -activePage * spacingPx }}
            transition={{ duration: isSpinning ? 0.12 : TRANSITION_DURATION, ease: isSpinning ? [0.22,1,0.36,1] : TRANSITION_EASE }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${W}px`,
              height: "100%",
            }}
          >
            {visiblePositions.map((p) => {
              const slideIdx = getCardIndex(p);
              return (
                <div
                  key={p}
                  style={{
                    position: "absolute",
                    left: `${Math.round(W * 0.5 + p * spacingPx)}px`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${cardWidthPx}px`,
                    height: "min(36vh, 340px)",
                  }}
                >
                  {renderSideCard(slideIdx, "left")}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── 2. MIDDLE WALL VIEWPORT (leftSeam to rightSeam, flat at rotateY(0deg)) ── */}
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{
            left: `${leftSeam}px`,
            width: `${midWidth}px`,
            transform: "none",
            transformStyle: "flat",
            pointerEvents: "auto",
          }}
        >
          <motion.div
            animate={{ x: -activePage * spacingPx }}
            transition={{ duration: isSpinning ? 0.12 : TRANSITION_DURATION, ease: isSpinning ? [0.22,1,0.36,1] : TRANSITION_EASE }}
            style={{
              position: "absolute",
              left: `${-leftSeam}px`,
              top: 0,
              width: `${W}px`,
              height: "100%",
            }}
          >
            {visiblePositions.map((p) => {
              const slideIdx = getCardIndex(p);
              const isCenter = p === activePage;
              return (
                <div
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation();
                    skipIntro();
                    if (p !== page) {
                      setPage(p);
                      startTimer();
                    } else {
                      handleActivePhotoClick(slideIdx);
                    }
                  }}
                  title={isCenter ? "Click to maximize photo in full window" : undefined}
                  style={{
                    position: "absolute",
                    left: `${Math.round(W * 0.5 + p * spacingPx)}px`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${cardWidthPx}px`,
                    height: "min(36vh, 340px)",
                    cursor: isCenter ? "zoom-in" : "pointer",
                  }}
                >
                  {renderMiddleCard(slideIdx, isCenter)}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── 3. RIGHT WALL VIEWPORT (rightSeam to W, angled at rotateY(-52deg)) ── */}
        <div
          className="absolute top-0 bottom-0 overflow-hidden cursor-pointer"
          style={{
            left: `${rightSeam}px`,
            width: `${rightWidth}px`,
            transformOrigin: "left center",
            transform: "rotateY(-52deg)",
            transformStyle: "flat",
            pointerEvents: "auto",
            /* Side walls appear with TV expand or once intro sequence completes */
            opacity: introComplete || isSideTvExpanding ? 1 : 0,
            transition: introComplete ? 'opacity 0.6s ease-out' : undefined,
          }}
          onClick={() => {
            skipIntro();
            setPage((p) => p + 1);
            startTimer();
          }}
        >
          <motion.div
            animate={{ x: -activePage * spacingPx }}
            transition={{ duration: isSpinning ? 0.12 : TRANSITION_DURATION, ease: isSpinning ? [0.22,1,0.36,1] : TRANSITION_EASE }}
            style={{
              position: "absolute",
              left: `${-rightSeam}px`,
              top: 0,
              width: `${W}px`,
              height: "100%",
            }}
          >
            {visiblePositions.map((p) => {
              const slideIdx = getCardIndex(p);
              return (
                <div
                  key={p}
                  style={{
                    position: "absolute",
                    left: `${Math.round(W * 0.5 + p * spacingPx)}px`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${cardWidthPx}px`,
                    height: "min(36vh, 340px)",
                  }}
                >
                  {renderSideCard(slideIdx, "right")}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Room Corner Crease Accent Vertex Lines (Locked to Room Corner) ── */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${leftSeam}px`,
            width: "1.5px",
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, rgba(34, 211, 238, 0.3) 0%, #22d3ee 50%, rgba(34, 211, 238, 0.3) 100%)",
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.8)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${rightSeam}px`,
            width: "1.5px",
            transform: "translateX(-50%)",
            background: "linear-gradient(180deg, rgba(34, 211, 238, 0.3) 0%, #22d3ee 50%, rgba(34, 211, 238, 0.3) 100%)",
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.8)",
          }}
        />
      </div>
      )}

      {/* ── Persistent Corner Crease Lines (Projected Wall Creases across entire room height) ── */}
      {!isVertical && (
        <>
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Wall Corner Crease */}
            <line x1="280" y1="65" x2="280" y2="465" stroke="#22d3ee" strokeWidth="1.5" opacity="0.65" />
            <line x1="280" y1="65" x2="280" y2="465" stroke="#22d3ee" strokeWidth="0.8" opacity="0.8" />
            {/* Right Wall Corner Crease */}
            <line x1="720" y1="65" x2="720" y2="465" stroke="#22d3ee" strokeWidth="1.5" opacity="0.65" />
            <line x1="720" y1="65" x2="720" y2="465" stroke="#22d3ee" strokeWidth="0.8" opacity="0.8" />
          </svg>
          {/* ── Full Height Corner Crease Shadows (Left & Right Wall Creases, Top to Bottom) ── */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 pointer-events-none z-22"
            style={{
              left: `${leftSeam - 32}px`,
              width: "64px",
              background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 pointer-events-none z-22"
            style={{
              left: `${rightSeam - 32}px`,
              width: "64px",
              background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0) 100%)",
            }}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CINEMATIC VOLUMETRIC PROJECTOR LIGHT RAYS
          (Wide volumetric cone projecting onto center card)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className={`absolute left-1/2 -translate-x-1/2 pointer-events-none overflow-visible${introStage === 2 ? " rays-settle" : ""}`}
        style={{
          bottom: isVertical ? "min(24vw, 100px)" : "175px",
          width: isVertical ? "min(92vw, 480px)" : "min(46vw, 460px)",
          height: isVertical
            ? "calc(100dvh * 0.28)"
            : "calc(100vh - 175px - min(36vh, 340px) - 175px)",
          minHeight: "70px",
          mixBlendMode: "screen",
          /* Raised above bottom image (zIndex: 10) but behind projector model (zIndex: 50) */
          zIndex: introComplete ? 42 : 48,
          /* Controlled by flicker schedule during stages 1-2; always on after */
          opacity: introComplete ? 1 : (showRays ? 1 : 0),
          transition: introStage >= 2 ? undefined : "none",
        }}
      >
        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mbg" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
              <stop offset="18%" stopColor="#00a2ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2f6bff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#001a66" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="bhz" cx="50%" cy="100%" r="90%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#2f6bff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#02060f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cbg" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="22%" stopColor="#80f0ff" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#00a2ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2f6bff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#2f6bff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#001a66" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Broad atmospheric ambient glow */}
          <polygon points="-120,0 720,0 330,300 270,300" fill="url(#bhz)" filter="blur(20px)" opacity="0.88" />
          {/* Main wide light body */}
          <polygon points="-50,0 650,0 318,300 282,300" fill="url(#mbg)" filter="blur(7px)" opacity="0.92" />
          {/* Wide fan of light streaks */}
          {[
            { p: "-60,0 15,0 300,300", o: 0.35 },
            { p: "0,0 80,0 300,300", o: 0.45 },
            { p: "65,0 155,0 300,300", o: 0.55 },
            { p: "140,0 235,0 300,300", o: 0.65 },
            { p: "220,0 315,0 300,300", o: 0.75 },
            { p: "285,0 380,0 300,300", o: 0.75 },
            { p: "365,0 460,0 300,300", o: 0.65 },
            { p: "445,0 535,0 300,300", o: 0.55 },
            { p: "520,0 600,0 300,300", o: 0.45 },
            { p: "585,0 660,0 300,300", o: 0.35 },
          ].map((r, i) => (
            <polygon key={i} points={r.p} fill="url(#cbg)" opacity={r.o} filter="blur(3px)" />
          ))}
          {/* Wide central high-intensity projection cone */}
          <polygon points="50,0 550,0 310,300 290,300" fill="url(#cbg)" filter="blur(4px)" opacity="0.82" />
          {/* Lens flare & emitter optics */}
          <ellipse cx="300" cy="296" rx="46" ry="16" fill="url(#lb)" filter="blur(2.5px)" />
          <ellipse cx="300" cy="296" rx="18" ry="7" fill="#ffffff" filter="blur(1px)" />
          <ellipse cx="300" cy="296" rx="110" ry="3" fill="#00e5ff" filter="blur(1.5px)" opacity="0.95" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3D INTERACTIVE PROJECTOR MODEL & CASSETTES
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-1/2 -translate-x-1/2 select-none"
        style={{
          bottom: "0px",
          width: isVertical ? "min(56vw, 240px)" : "min(56vw, 460px)",
          transform: "translateX(-50%)",
          /* Projector is always visible from the start */
          opacity: 1,
          /* Explicit zIndex: 50 brings projector in front of bottom card (zIndex: 10) */
          zIndex: 50,
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: "1672 / 941" }}>
          <Image
            src="/assets/project-transparent.webp"
            alt="3D Interactive Projector"
            fill
            className="object-contain pointer-events-none drop-shadow-[0_16px_35px_rgba(0,0,0,0.98)]"
            priority
            quality={95}
          />

          {/* PREVIOUS Cassette */}
          <button
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous slide"
            className="absolute z-10 cursor-pointer overflow-hidden rounded-[3px] group focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
            style={{
              left: "21.53%",
              top: "48.35%",
              width: "14.35%",
              height: "26.04%",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
            }}
          >
            <div
              key={isSlotSpinning ? `cassette-prev-${displayPrevIndex}` : 'static'}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                animation: isSlotSpinning ? 'slot-roll 0.08s ease-in-out' : 'none',
              }}
            >
              <Image
                src={imgSrc(displayPrevIndex)}
                alt="Previous Slide"
                fill
                className="object-cover opacity-60 group-hover:opacity-85 transition-opacity"
                sizes="100px"
                quality={75}
                loading="lazy"
                style={{ filter: "brightness(0.7) contrast(120%) grayscale(30%)" }}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(47,107,255,0.25) 0%, transparent 100%)",
                mixBlendMode: "color",
              }}
            />
          </button>

          {/* CURRENT Active Cassette */}
          <button
            onClick={() => handleActivePhotoClick(currentIndex)}
            aria-label="Maximize active slide"
            title="Click to maximize photo in full window"
            className="absolute z-10 overflow-hidden rounded-[4px] cursor-zoom-in group focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
            style={{
              left: "40.07%",
              top: "47.29%",
              width: "17.64%",
              height: "27.63%",
              border: "1.5px solid #00d4ff",
              boxShadow:
                "0 0 16px rgba(0,212,255,0.85), 0 0 35px rgba(0,150,255,0.4), inset 0 0 10px rgba(0,212,255,0.4)",
            }}
          >
            <div className="relative w-full h-full">
              <div
                key={isSlotSpinning ? `cassette-curr-${displayIndex}` : 'static'}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  animation: isSlotSpinning ? 'slot-roll 0.08s ease-in-out' : 'none',
                }}
              >
                <Image
                  src={imgSrc(displayIndex)}
                  alt="Current Slide"
                  fill
                  className="object-cover"
                  sizes="130px"
                  quality={75}
                  loading="eager"
                />
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(76,255,138,0.15) 100%)",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </button>

          {/* NEXT Cassette */}
          <button
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next slide"
            className="absolute z-10 cursor-pointer overflow-hidden rounded-[3px] group focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
            style={{
              left: "62.50%",
              top: "48.35%",
              width: "14.35%",
              height: "26.04%",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
            }}
          >
            <div
              key={isSlotSpinning ? `cassette-next-${displayNextIndex}` : 'static'}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                animation: isSlotSpinning ? 'slot-roll 0.08s ease-in-out' : 'none',
              }}
            >
              <Image
                src={imgSrc(displayNextIndex)}
                alt="Next Slide"
                fill
                className="object-cover opacity-60 group-hover:opacity-85 transition-opacity"
                sizes="100px"
                quality={75}
                loading="lazy"
                style={{ filter: "brightness(0.7) contrast(120%) grayscale(30%)" }}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(47,107,255,0.25) 0%, transparent 100%)",
                mixBlendMode: "color",
              }}
            />
          </button>

          {/* Interactive Dial Hotspots */}
          <button
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous Control Dial"
            className="absolute z-20 cursor-pointer focus:outline-none"
            style={{ left: "35.8%", top: "48%", width: "4.2%", height: "26%", opacity: 0 }}
          />
          <button
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next Control Dial"
            className="absolute z-20 cursor-pointer focus:outline-none"
            style={{ left: "58.2%", top: "48%", width: "4.2%", height: "26%", opacity: 0 }}
          />
        </div>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 z-30 flex gap-2 pointer-events-auto"
        style={{
          bottom: isVertical ? "12px" : "32px",
          opacity: introComplete || chromeVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-out'
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => { skipIntro(); goTo(i); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex ? "w-8 h-2 bg-cyan-400 shadow-[0_0_10px_#00d4ff]" : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Maximized Lightbox Modal for Active Photo with Cross Symbol Minimize */}
      <PhotoLightboxModal
        isOpen={Boolean(activeModalPhoto)}
        onClose={handleCloseModal}
        src={activeModalPhoto?.src}
        title={activeModalPhoto?.title}
        alt={activeModalPhoto?.alt || "Maximized Projector Exhibit Slide"}
      />
    </section>
  );
};

export default HorizontalCarousel;
