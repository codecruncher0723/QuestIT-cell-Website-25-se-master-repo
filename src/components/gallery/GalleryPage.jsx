"use client";

import { useEffect } from "react";
import LogoSection from "./LogoSection";
import HorizontalCarousel from "./HorizontalCarousel";
import QuotationSection from "./QuotationSection";
import MemoriesSection from "./MemoriesSection";
import "@/styles/gallery-animations.css";

const GalleryPage = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      {/* Logo Hero Section */}
      <LogoSection />

      {/* 3D Horizontal Carousel Exhibition */}
      <HorizontalCarousel />

      {/* Quotation Section */}
      <QuotationSection />

      {/* Memories Section */}
      <MemoriesSection />
    </div>
  );
};

export default GalleryPage;
