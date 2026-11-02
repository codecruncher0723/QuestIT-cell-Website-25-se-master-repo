import GalleryPage from "@/components/gallery/GalleryPage";
import { Suspense } from "react";
import GalleryLoading from "@/components/gallery/GalleryLoading";

export const metadata = {
  title: "Gallery | Quest-IT",
  description: "Explore Quest-IT memories through our interactive gallery showcasing unforgettable moments and events. Experience stunning animations and relive our journey.",
  keywords: ["Quest-IT", "Gallery", "Memories", "Events", "Photos", "Animation"],
  openGraph: {
    title: "Gallery | Quest-IT",
    description: "Explore Quest-IT memories through our interactive gallery",
    images: [
      {
        url: "/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Quest-IT Gallery",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Quest-IT",
    description: "Explore Quest-IT memories through our interactive gallery",
    images: ["/images/logo.webp"],
  },
  alternates: {
    canonical: "/gallery",
  },
};

export default function Gallery() {
  return (
    <Suspense fallback={<GalleryLoading />}>
      <GalleryPage />
    </Suspense>
  );
}
