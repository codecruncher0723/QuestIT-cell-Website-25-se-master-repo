"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  animate,
  useInView,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PhotoLightboxModal from "./PhotoLightboxModal";

/* ─── Orbital Memories Exhibition Images ───────────────────────────────────── */
const ORBITAL_IMAGES = [
  "/images/gallery-images/Orbital/diagonal_12.jpg",
  "/images/gallery-images/Orbital/diagonal_9.png",
  "/images/gallery-images/Orbital/dinner-photo_1920x1080.png",
  "/images/gallery-images/Orbital/download_1920x1080.png",
  "/images/gallery-images/Orbital/firstmeet_1920x1080.png",
  "/images/gallery-images/Orbital/IMG_1633_1920x1080.png",
  "/images/gallery-images/Orbital/IMG_2522_1920x1080.png",
  "/images/gallery-images/Orbital/IMG_2829_1920x1080.png",
  "/images/gallery-images/Orbital/IMG_3955_1920x1080.png",
  "/images/gallery-images/Orbital/rshb-vwq_1920x1080.png",
  "/images/gallery-images/Orbital/shivam-bw1_1920x1080.png",
  "/images/gallery-images/Orbital/table-2_1920x1080.png",
];

const INITIAL_OFFSET_INDEX = 2;
const TOTAL_CARDS = ORBITAL_IMAGES.length;
const PAUSE_MS = 1800;
const ROTATION_DURATION = 0.95;

const mod = (n, m) => ((n % m) + m) % m;

// Sub-component for each 3D Memory Card with single flip, elevation, and size transitions
const MemoryCard = ({
  card,
  cardWidth,
  cardHeight,
  isFocal,
  liftY,
  activeScale,
  animDuration,
  onCardClick,
  onActivePhotoClick,
}) => {
  return (
    <div
      onClick={() => {
        if (!isFocal && onCardClick) {
          onCardClick(card.index);
        } else if (isFocal && onActivePhotoClick) {
          onActivePhotoClick(card.src, card.index);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isFocal && onCardClick) {
            onCardClick(card.index);
          } else if (isFocal && onActivePhotoClick) {
            onActivePhotoClick(card.src, card.index);
          }
        }
      }}
      aria-label={
        isFocal
          ? `Active Quest-IT Memory ${card.index + 1} - Click to maximize`
          : `Select Quest-IT Memory ${card.index + 1}`
      }
      title={
        isFocal
          ? "Click to maximize photo in full window"
          : `View Memory ${card.index + 1}`
      }
      className={`group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none active:outline-none select-none ${
        isFocal ? "cursor-zoom-in" : "cursor-pointer"
      }`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        marginLeft: `-${cardWidth / 2}px`,
        marginTop: `-${cardHeight / 2}px`,
        transform: `translate3d(${card.x}px, ${card.y}px, ${card.z}px) rotateX(${card.rotateX || 0}deg) rotateY(${card.rotateY || 0}deg) rotateZ(${card.rotateZ || 0}deg) scale(${card.baseScale})`,
        zIndex: isFocal ? 150 : card.zIndex,
        opacity: card.opacity,
        filter: `brightness(${card.brightness})${
          card.blur > 0.1 ? ` blur(${card.blur}px)` : ""
        }`,
        willChange: "transform, opacity, filter",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        pointerEvents: card.isVisible ? "auto" : "none",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.div
        initial={{
          rotateY: 0,
          y: 0,
          scale: 1,
        }}
        animate={{
          rotateY: isFocal ? 180 : 0,
          y: isFocal ? liftY : 0,
          scale: isFocal ? activeScale : 1,
        }}
        transition={{
          duration: animDuration || ROTATION_DURATION,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="relative w-full h-full outline-none"
        style={{
          transformStyle: "preserve-3d",
          outline: "none",
        }}
      >
        {/* FRONT FACE: Mirrored photograph (visible when inactive in orbit at rotateY: 0) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 transition-all duration-300 outline-none ${
            !isFocal
              ? "group-hover:border-cyan-400/70 group-hover:shadow-[0_0_25px_rgba(0,212,255,0.45)] group-hover:scale-[1.03]"
              : ""
          }`}
          style={{
            transform: "rotateY(0deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            border: isFocal
              ? "2px solid rgba(0, 212, 255, 0.95)"
              : "1px solid rgba(0, 212, 255, 0.2)",
            boxShadow: isFocal
              ? "0 0 35px rgba(0, 212, 255, 0.65), 0 25px 50px rgba(0, 0, 0, 0.95)"
              : "0 10px 28px rgba(0, 0, 0, 0.75)",
            outline: "none",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          >
            <Image
              src={card.src}
              alt={`Quest-IT Memory ${card.index + 1} (Mirrored)`}
              fill
              quality={95}
              sizes="(max-width: 640px) 350px, (max-width: 1024px) 550px, 800px"
              className="object-cover select-none pointer-events-none"
              priority={card.index < 4}
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(0, 0, 0, ${
                0.35 * (1 - (isFocal ? 1 : 0))
              }), transparent 55%)`,
            }}
          />
        </div>

        {/* BACK FACE: Original photograph (visible when active in focal spotlight at rotateY: 180) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 transition-colors duration-200 outline-none"
          style={{
            transform: "rotateY(180deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            border: isFocal
              ? "2px solid rgba(0, 212, 255, 0.95)"
              : "1px solid rgba(0, 212, 255, 0.2)",
            boxShadow: isFocal
              ? "0 0 45px rgba(0, 212, 255, 0.7), 0 30px 60px rgba(0, 0, 0, 0.95)"
              : "0 10px 28px rgba(0, 0, 0, 0.75)",
            outline: "none",
          }}
        >
          <Image
            src={card.src}
            alt={`Quest-IT Memory ${card.index + 1}`}
            fill
            quality={95}
            sizes="(max-width: 640px) 450px, (max-width: 1024px) 700px, 1000px"
            className="object-cover select-none pointer-events-none"
            priority={card.index < 4}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, rgba(0, 0, 0, ${
                0.35 * (1 - (isFocal ? 1 : 0))
              }), transparent 55%)`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const MemoriesSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const orbitCanvasRef = useRef(null);

  // Detect when Memories section is in view to run auto-rotation
  const isInView = useInView(sectionRef, { amount: 0.25 });

  // Dynamic responsive dimensions derived directly from container measurements
  const [stageDimensions, setStageDimensions] = useState({
    width: 1200,
    height: 700,
  });

  // Step counter for carousel position
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  // Separate focal step tracking so flip & elevation trigger right when card lands in center
  const [focalStep, setFocalStep] = useState(null);
  const focalStepRef = useRef(null);

  // Synchronized animation duration so 3D flip/elevation matches orbit progress travel time
  const [animDuration, setAnimDuration] = useState(ROTATION_DURATION);

  const progressMV = useMotionValue(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Active photo pop-up modal state for max view
  const [modalPhoto, setModalPhoto] = useState(null);

  const timeoutRef = useRef(null);
  const animControlsRef = useRef(null);
  const isCancelledRef = useRef(false);
  const scheduleNextRotationRef = useRef(null);

  useMotionValueEvent(progressMV, "change", (latest) => {
    setCurrentProgress(latest);
  });

  // Clicking the active photo opens full window max view and pauses auto-rotation
  const handleActivePhotoClick = (src, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setModalPhoto({
      src,
      title: `QUEST-IT Memory ${index + 1}`,
    });
  };

  // Minimizing modal resumes auto-rotation
  const handleCloseModal = () => {
    setModalPhoto(null);
    if (scheduleNextRotationRef.current) {
      scheduleNextRotationRef.current();
    }
  };

  // Core rotation orchestrator: animates orbit to targetStep and synchronizes focal flip
  const rotateToStep = (targetStep, customDuration = ROTATION_DURATION) => {
    if (isCancelledRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (animControlsRef.current) {
      animControlsRef.current.stop();
    }

    stepRef.current = targetStep;
    focalStepRef.current = targetStep;
    setStep(targetStep);
    setFocalStep(targetStep);
    setAnimDuration(customDuration);

    animControlsRef.current = animate(progressMV, targetStep, {
      duration: customDuration,
      ease: [0.25, 1, 0.5, 1],
      onComplete: () => {
        if (isCancelledRef.current) return;
        setAnimDuration(ROTATION_DURATION);
        if (scheduleNextRotationRef.current) {
          scheduleNextRotationRef.current();
        }
      },
    });
  };

  // Schedule auto-rotation to next card after showcase pause
  scheduleNextRotationRef.current = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isCancelledRef.current) return;
      rotateToStep(stepRef.current + 1, ROTATION_DURATION);
    }, PAUSE_MS);
  };

  // Click on non-active card: smoothly orbit to that card and spotlight it as active
  const handleCardClick = (targetIndex) => {
    const currentActiveIndex =
      focalStepRef.current !== null
        ? mod(INITIAL_OFFSET_INDEX + focalStepRef.current, TOTAL_CARDS)
        : INITIAL_OFFSET_INDEX;

    if (targetIndex === currentActiveIndex) {
      return; // Already the active card
    }

    const currentVal = progressMV.get();

    // Determine the closest targetStep that positions targetIndex at the focal center
    const baseK = Math.round(
      (currentVal - (targetIndex - INITIAL_OFFSET_INDEX)) / TOTAL_CARDS
    );
    const targetStep = targetIndex - INITIAL_OFFSET_INDEX + baseK * TOTAL_CARDS;

    if (targetStep === focalStepRef.current) return;

    // Responsive duration proportional to travel distance (capped between 0.75s and 1.35s)
    const dist = Math.abs(targetStep - currentVal);
    const customDuration = Math.min(0.75 + Math.max(dist - 1, 0) * 0.18, 1.35);

    rotateToStep(targetStep, customDuration);
  };

  // Touch swipe support for mobile horizontal navigation
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Check if horizontal swipe exceeds 35px and is predominantly horizontal
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> advance to next memory
        rotateToStep(stepRef.current + 1);
      } else {
        // Swiped Right -> return to previous memory
        rotateToStep(stepRef.current - 1);
      }
    }
  };

  // Automatic rotation lifecycle when section is in view
  useEffect(() => {
    if (!isInView) {
      isCancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animControlsRef.current) animControlsRef.current.stop();
      return;
    }

    isCancelledRef.current = false;

    // Initial spotlight trigger for the starting center card after 350ms
    const initialTimer = setTimeout(() => {
      if (!isCancelledRef.current) {
        focalStepRef.current = 0;
        setFocalStep(0);
        if (scheduleNextRotationRef.current) {
          scheduleNextRotationRef.current();
        }
      }
    }, 350);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(initialTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animControlsRef.current) animControlsRef.current.stop();
    };
  }, [isInView]);

  // Measure actual container dimensions dynamically via ResizeObserver
  useEffect(() => {
    if (!stageRef.current) return;

    const updateMeasurements = () => {
      if (stageRef.current) {
        setStageDimensions({
          width: stageRef.current.clientWidth || window.innerWidth,
          height: stageRef.current.clientHeight || window.innerHeight,
        });
      }
    };

    updateMeasurements();
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(stageRef.current);
    window.addEventListener("resize", updateMeasurements);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, []);

  // Compute responsive geometry derived from container width W & height H
  const {
    isMobile,
    Rx,
    Ry,
    Rz,
    cardWidth,
    cardHeight,
    visibleSlots,
    angularSpacing,
    maxDiff,
    fadeZone,
    liftY,
    activeScale,
  } = useMemo(() => {
    const W = stageDimensions.width;
    const H = stageDimensions.height;
    const mobile = W < 768;

    if (mobile) {
      // MOBILE HORIZONTAL 3D ORBITAL (W < 768px)
      // Exactly 3 cards visible at a time: 1 middle active + 2 side non-active
      const cw = Math.min(Math.max(Math.round(W * 0.44), 145), 195);
      const ch = Math.round(cw * 0.68);

      // Symmetrical horizontal spread so side cards peek cleanly without horizontal overflow
      const rx = Math.max(Math.round(W * 0.36), 125);
      // Subtle vertical swoop along the orbital arc
      const ry = Math.round(rx * 0.22);
      // Deep 3D Z-depth for perspective curvature
      const rz = Math.round(rx * 0.50);

      // Angular spacing (~47 degrees / 0.82 rad)
      const spacing = 0.82;
      // Strict threshold so ONLY absDiff <= 1 is in view at rest (exactly 3 cards)
      const maxD = 1.35;
      const fZone = 0.35;

      const lift = -16;
      const scale = 1.25;

      return {
        isMobile: true,
        Rx: rx,
        Ry: ry,
        Rz: rz,
        cardWidth: cw,
        cardHeight: ch,
        visibleSlots: 3,
        angularSpacing: spacing,
        maxDiff: maxD,
        fadeZone: fZone,
        liftY: lift,
        activeScale: scale,
      };
    } else {
      // DESKTOP & TABLET HORIZONTAL 3D ELLIPTICAL ORBITAL GALLERY (W >= 768px)
      const tablet = W < 1024;
      const slots = tablet ? 6 : 8;

      const rawCw = tablet
        ? Math.min(W * 0.28, H * 0.24)
        : Math.min(W * 0.21, H * 0.29);

      const cw = tablet
        ? Math.min(Math.max(Math.round(rawCw), 190), 250)
        : Math.min(Math.max(Math.round(rawCw), 240), 340);

      const ch = Math.round(cw * 0.76);

      // Curvy, deep 3D elliptical radii in X, Y, and Z
      const rawRx = (W * 0.82 - cw * 0.65) / 2;
      const rx = Math.max(Math.round(rawRx), 85);
      // Significantly increased Ry (0.38x instead of 0.22x) for a rich, sweeping vertical swoop
      const ry = Math.round(rx * 0.38);
      // Deep Z depth (0.52x instead of 0.28x) for prominent 3D front-to-back perspective curve
      const rz = Math.round(rx * 0.52);

      const lift = tablet ? -120 : -150;
      const scale = tablet ? 1.52 : 1.58;

      return {
        isMobile: false,
        Rx: rx,
        Ry: ry,
        Rz: rz,
        cardWidth: cw,
        cardHeight: ch,
        visibleSlots: slots,
        angularSpacing: (2 * Math.PI) / slots,
        maxDiff: slots / 2,
        fadeZone: 0.75,
        liftY: lift,
        activeScale: scale,
      };
    }
  }, [stageDimensions]);

  // Calculate 3D orbital positioning and dynamic cycling of all 15 images
  const cards = useMemo(() => {
    // Start with diagonal_3 (index 2) front and center initially
    const INITIAL_OFFSET_INDEX = 2;
    // Current center index advances continuously across all 15 images as carousel rotates
    const currentCenter = INITIAL_OFFSET_INDEX + currentProgress;

    // Active focal index is only active when a card is in the showcase spotlight (not during ring rotation)
    const activeFocalIndex =
      focalStep !== null
        ? mod(INITIAL_OFFSET_INDEX + focalStep, TOTAL_CARDS)
        : -1;

    return Array.from({ length: TOTAL_CARDS }).map((_, i) => {
      // Signed angular distance from current focal position, wrapped modulo TOTAL_CARDS
      let diff = (i - currentCenter) % TOTAL_CARDS;
      while (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
      while (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;

      const absDiff = Math.abs(diff);

      // Smooth fade factor as cards enter and depart at the back of the ellipse
      let fade = 0;
      if (absDiff < maxDiff) {
        fade = absDiff > maxDiff - fadeZone ? (maxDiff - absDiff) / fadeZone : 1.0;
      }

      // Orbital angle on the 3D horizontal ellipse
      const theta = diff * angularSpacing;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let x, y, z, rotateX, rotateY, rotateZ, depthFactor, baseScale, brightness, blur;

      if (isMobile) {
        // MOBILE 3-CARD HORIZONTAL 3D ORBIT
        x = Math.round(Rx * sinT * 10) / 10;
        y = Math.round(Ry * cosT * 10) / 10;
        z = Math.round(Rz * cosT * 10) / 10;

        // Elegant 3D perspective banking along the horizontal curve
        rotateX = Math.round(cosT * 8 * 10) / 10;
        rotateY = Math.round(-sinT * 42 * 10) / 10;
        rotateZ = Math.round(sinT * 4 * 10) / 10;

        depthFactor = (cosT + 1) / 2;
        baseScale = 0.74 + depthFactor * 0.20;
        brightness = Math.round((0.68 + depthFactor * 0.32) * 100) / 100;
        blur = Math.round((1 - depthFactor) * 0.3 * 10) / 10;
      } else {
        // DESKTOP / TABLET HORIZONTAL 3D ORBIT
        x = Math.round(Rx * sinT * 10) / 10;
        y = Math.round(Ry * cosT * 10) / 10;
        z = Math.round(Rz * cosT * 10) / 10;

        // Inward tangent banking along the deep 3D curve
        rotateX = Math.round(cosT * 12 * 10) / 10;
        rotateY = Math.round(-sinT * 50 * 10) / 10;
        rotateZ = Math.round(sinT * 5 * 10) / 10;

        depthFactor = (cosT + 1) / 2;
        baseScale = 0.70 + depthFactor * 0.26;
        brightness = Math.round((0.62 + depthFactor * 0.38) * 100) / 100;
        blur = Math.round((1 - depthFactor) * 0.4 * 10) / 10;
      }

      // Focal state strictly tied to active step
      const isFocal = i === activeFocalIndex;

      // Opacity multiplied by the smooth fade window
      const minOpacity = isMobile ? 0.75 : 0.68;
      const baseOpacity = minOpacity + depthFactor * (1 - minOpacity);
      const finalOpacity = Math.round(baseOpacity * fade * 100) / 100;

      // Strict dynamic z-index based on depth so front active card always occludes rear cards
      const zIndex = isFocal ? 150 : Math.round(depthFactor * 100) + 1;

      return {
        index: i,
        src: ORBITAL_IMAGES[i % TOTAL_CARDS],
        x,
        y,
        z,
        rotateX,
        rotateY,
        rotateZ,
        baseScale: Math.round(baseScale * 1000) / 1000,
        brightness,
        opacity: finalOpacity,
        blur,
        zIndex,
        isFocal,
        isVisible: fade > 0.01,
      };
    });
  }, [
    isMobile,
    Rx,
    Ry,
    Rz,
    currentProgress,
    focalStep,
    angularSpacing,
    maxDiff,
    fadeZone,
  ]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-black overflow-hidden flex flex-col items-center justify-center select-none ${
        isMobile ? "py-4 min-h-0" : "py-6 md:py-8 min-h-[80vh] justify-between"
      }`}
      style={
        isMobile
          ? undefined
          : {
              height: "min(95dvh, 800px)",
              minHeight: "560px",
            }
      }
    >
      {/* Viewport Container */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full flex flex-col overflow-visible bg-black select-none ${
          isMobile
            ? "items-center justify-center gap-1 sm:gap-2 h-auto"
            : "h-full justify-between"
        }`}
        style={{
          perspective: isMobile ? "900px" : "1300px",
          perspectiveOrigin: "50% 50%",
          paddingInline: isMobile ? "0" : "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Header */}
        <div className="pt-2 sm:pt-4 md:pt-8 px-4 sm:px-6 md:px-12 lg:px-16 z-30 pointer-events-none text-center md:text-left w-full">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2 tracking-tight">
            QUEST-IT <span className="text-cyan-400">Memories</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base tracking-wide">
            A Journey of Moments
          </p>
        </div>

        {/* 3D Orbital Canvas Area */}
        <div
          ref={orbitCanvasRef}
          className={`relative w-full flex items-center justify-center overflow-visible ${
            isMobile
              ? "h-[190px] sm:h-[220px] my-2"
              : "flex-1 -translate-y-4 md:-translate-y-8 my-0"
          }`}
          style={{
            transformStyle: "preserve-3d",
            marginInline: "auto",
          }}
        >
          {/* Central Background Quest Logo Watermark & Ambient Radial Cyan Glow */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center"
            style={{
              transform: "translate3d(-50%, -50%, -20px)",
              zIndex: 0,
            }}
          >
            {/* Ambient Cyan Backlight Glow */}
            <div
              className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[480px] md:h-[380px] rounded-full blur-[45px] md:blur-[75px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0, 212, 255, 0.22) 0%, rgba(34, 211, 238, 0.08) 50%, transparent 75%)",
              }}
            />

            {/* Glowing Quest Logo */}
            <div className="relative w-[180px] h-[75px] sm:w-[250px] sm:h-[105px] md:w-[400px] md:h-[160px] lg:w-[480px] lg:h-[190px] opacity-25 md:opacity-30">
              <Image
                src="/images/logo.png"
                alt=""
                fill
                className="object-contain filter drop-shadow-[0_0_25px_rgba(0,212,255,0.45)]"
                priority
              />
            </div>
          </div>

          {/* Active 3D Orbital Memory Photograph Cards */}
          {cards.map((card) => {
            if (!card.isVisible) return null;

            return (
              <MemoryCard
                key={card.index}
                card={card}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isFocal={card.isFocal}
                liftY={liftY}
                activeScale={activeScale}
                animDuration={animDuration}
                onCardClick={handleCardClick}
                onActivePhotoClick={handleActivePhotoClick}
              />
            );
          })}
        </div>

        {/* Mobile Navigation Controls & Counter */}
        {isMobile ? (
          <div className="flex items-center justify-center gap-4 sm:gap-5 z-30 pt-1 pb-1 select-none">
            <button
              type="button"
              onClick={() => rotateToStep(stepRef.current - 1)}
              aria-label="Previous Memory"
              className="p-2 sm:p-2.5 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.2)] active:scale-90 transition-all hover:bg-cyan-400/15 hover:border-cyan-400"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-cyan-400/90 font-medium">
              {String(mod(INITIAL_OFFSET_INDEX + (focalStep !== null ? focalStep : step), TOTAL_CARDS) + 1).padStart(2, "0")}{" "}
              <span className="text-neutral-500">/</span> {String(TOTAL_CARDS).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => rotateToStep(stepRef.current + 1)}
              aria-label="Next Memory"
              className="p-2 sm:p-2.5 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.2)] active:scale-90 transition-all hover:bg-cyan-400/15 hover:border-cyan-400"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        ) : (
          <div className="pb-4 md:pb-6 px-6 md:px-12 pointer-events-none" />
        )}
      </div>

      {/* Maximized Lightbox Modal for Active Photo with Cross Symbol Minimize */}
      <PhotoLightboxModal
        isOpen={Boolean(modalPhoto)}
        onClose={handleCloseModal}
        src={modalPhoto?.src}
        title={modalPhoto?.title}
        alt="Maximized Quest-IT Memory Photo"
      />
    </section>
  );
};

export default MemoriesSection;
