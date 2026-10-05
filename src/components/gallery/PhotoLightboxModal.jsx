"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PhotoLightboxModal = ({ isOpen, onClose, src, alt }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          key="photo-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/95 backdrop-blur-md select-none"
          onClick={onClose}
        >
          {/* Close Button with Cross Symbol (Always on top and fully visible) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close photo view"
            title="Minimize (ESC)"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[1000000] p-3 sm:p-3.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white/90 hover:text-white border border-white/20 hover:border-cyan-400 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(0,212,255,0.7)] group"
          >
            {/* Crisp SVG Cross Symbol */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Modal Container — Pure Maximized Photo View */}
          <motion.div
            key="photo-lightbox-content"
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center max-w-[95vw] max-h-[92vh] rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-400/50 shadow-[0_0_60px_rgba(0,212,255,0.35),0_25px_60px_rgba(0,0,0,0.95)] bg-neutral-950"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Max View Image */}
            <div className="relative w-[88vw] h-[82vh] sm:w-[86vw] sm:h-[86vh] max-w-[1360px] max-h-[880px] flex items-center justify-center p-2 sm:p-3">
              <Image
                src={src}
                alt={alt || "Maximized Memory Photo"}
                fill
                quality={100}
                sizes="95vw"
                className="object-contain rounded-xl select-none"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PhotoLightboxModal;

