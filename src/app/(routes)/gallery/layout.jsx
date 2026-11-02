export default function GalleryLayout({ children }) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Quest-IT Gallery",
            "description": "Interactive gallery showcasing Quest-IT memories and events",
            "url": "https://yourdomain.com/gallery",
            "image": "https://yourdomain.com/images/logo.webp",
            "author": {
              "@type": "Organization",
              "name": "Quest-IT",
              "url": "https://yourdomain.com"
            },
            "datePublished": new Date().toISOString(),
            "interactionStatistic": {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/ViewAction",
              "userInteractionCount": 0
            }
          })
        }}
      />
      {children}
    </>
  );
}
