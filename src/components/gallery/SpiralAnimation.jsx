"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward } from "lucide-react";

const SpiralAnimation = ({ onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const totalFrames = 13;
  const frameDelay = 400; // 400ms per frame for smoother animation

  useEffect(() => {
    // Get viewport size for responsive radius calculation
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);

    // Show skip button after 1 second
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1000);

    return () => {
      clearTimeout(skipTimer);
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  useEffect(() => {
    if (currentFrame < totalFrames) {
      const timer = setTimeout(() => {
        setCurrentFrame(currentFrame + 1);
      }, frameDelay);
      return () => clearTimeout(timer);
    } else {
      // Animation complete, fade out and trigger next phase
      const completeTimer = setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 300);
      return () => clearTimeout(completeTimer);
    }
  }, [currentFrame, onComplete]);

  const handleSkip = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  // Get position for circular arrangement - RESPONSIVE to viewport
  const getOvalPosition = (index, totalImages) => {
    const angle = (index / totalImages) * Math.PI * 2;
    
    // Calculate radius based on viewport - smaller viewport = smaller radius
    const isMobile = viewportSize.width < 768;
    const imageSize = isMobile ? 130 : 150;
    
    // Use 25% of the smaller viewport dimension for radius
    const viewportMin = Math.min(viewportSize.width, viewportSize.height);
    const radius = Math.max(viewportMin * 0.25, 180); // Min 180px, scales up with viewport
    
    // Random scatter for natural look - scale with radius
    const scatterScale = radius / 280; // Scale scatter based on radius
    const scatterPatterns = [
      { x: -60 * scatterScale, y: 40 * scatterScale, rotation: -8 },
      { x: 70 * scatterScale, y: -35 * scatterScale, rotation: 12 },
      { x: -45 * scatterScale, y: 55 * scatterScale, rotation: -15 },
      { x: 75 * scatterScale, y: 30 * scatterScale, rotation: 10 },
      { x: 0, y: -65 * scatterScale, rotation: -5 },
      { x: -80 * scatterScale, y: -25 * scatterScale, rotation: 14 },
      { x: 50 * scatterScale, y: 70 * scatterScale, rotation: -10 },
      { x: -40 * scatterScale, y: -55 * scatterScale, rotation: 8 },
      { x: 65 * scatterScale, y: -45 * scatterScale, rotation: -12 },
      { x: -70 * scatterScale, y: 35 * scatterScale, rotation: 15 },
      { x: 45 * scatterScale, y: -40 * scatterScale, rotation: -7 },
      { x: -75 * scatterScale, y: 60 * scatterScale, rotation: 11 },
      { x: 85 * scatterScale, y: 25 * scatterScale, rotation: -9 },
    ];
    
    const scatter = scatterPatterns[index] || { x: 0, y: 0, rotation: 0 };
    
    return {
      x: Math.cos(angle) * radius + scatter.x,
      y: Math.sin(angle) * radius + scatter.y,
      rotation: scatter.rotation,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Skip Button */}
      <AnimatePresence>
        {showSkip && !isComplete && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={handleSkip}
            className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Skip animation"
          >
            <span className="hidden sm:inline">Skip</span>
            <SkipForward className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-cyan-400"
        initial={{ width: "0%" }}
        animate={{ width: `${(currentFrame / totalFrames) * 100}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Camera zoom effect - photos in circular positions, camera zooms in */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        initial={{ scale: 0.3 }}
        animate={{ scale: currentFrame >= totalFrames ? 3 : 0.3 + (currentFrame / totalFrames) * 2.7 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {Array.from({ length: totalFrames }).map((_, index) => {
          const position = getOvalPosition(index, totalFrames);
          const isVisible = index < currentFrame;
          const progress = currentFrame / totalFrames;
          
          // Fade out as camera zooms in close
          const fadeProgress = progress > 0.75 ? (progress - 0.75) / 0.25 : 0;
          const opacity = isVisible ? 0.95 - fadeProgress * 0.95 : 0;
          
          return (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0,
                x: position.x,
                y: position.y,
                rotate: (index % 5 - 2) * 8,
              }}
              animate={{
                opacity: opacity,
                x: position.x,
                y: position.y,
                rotate: (index % 5 - 2) * 8,
              }}
              transition={{
                opacity: { duration: 0.5, ease: "easeInOut" },
                x: { duration: 0 },
                y: { duration: 0 },
                rotate: { duration: 0.5, ease: "easeOut" },
              }}
              className="absolute"
              style={{
                zIndex: 10 + index,
              }}
            >
              <div className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px]">
                <Image
                  src={`/images/gallery-images/spiral_images/spiral_${index + 1}.webp`}
                  alt={`Spiral frame ${index + 1}`}
                  fill
                  className="object-cover rounded-lg shadow-2xl gallery-image-mobile"
                  priority={index <= 3}
                  quality={85}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center Quest-IT logo fading out smoothly with images */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: 1 + (currentFrame / totalFrames) * 0.3,
          opacity: currentFrame < totalFrames * 0.7 ? 1 - (currentFrame / totalFrames) * 1.4 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="absolute inset-0 flex items-center justify-center z-30"
      >
        <div className="relative w-[200px] h-[80px] md:w-[300px] md:h-[120px]">
          <Image
            src="/images/logo.webp"
            alt="Quest-IT Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentFrame === 0 ? 1 : 0 }}
        className="absolute text-white text-lg tracking-wider"
      >
        Loading Gallery...
      </motion.div>
    </motion.div>
  );
};

export default SpiralAnimation;
