export const dynamic = "force-static";
const manifest = () => {
  return {
    id: "/",
    start_url: "/",
    name: "QuestIT",
    orientation: "any",
    short_name: "QuestIT",
    display: "standalone",
    theme_color: "#00FAFF",
    background_color: "#0A0F1B",
    description:
      "A platform for students of VESIT to Learn, Compete & Have Fun through various Technical and Non-technical Events.",
    icons: [
      {
        sizes: "192x192",
        type: "image/png",
        src: "/images/icon-192x192.webp",
      },
      {
        sizes: "512x512",
        type: "image/png",
        src: "/images/icon-512x512.webp",
      },
    ],
    screenshots: [
      {
        label: "Home",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/home.webp",
      },
      {
        label: "About",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/about.webp",
      },
      {
        label: "Events",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/events.webp",
      },
      {
        label: "Team",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/team.webp",
      },
      {
        type: "image/png",
        sizes: "1179x2556",
        label: "Developers",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/developers.webp",
      },
      {
        label: "Home",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/home.webp",
      },
      {
        label: "About",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/about.webp",
      },
      {
        label: "Events",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/events.webp",
      },
      {
        label: "Team",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/team.webp",
      },
      {
        type: "image/png",
        sizes: "1292x727",
        label: "Developers",
        form_factor: "wide",
        src: "/images/screenshots/desktop/developers.webp",
      },
    ],
  };
};

export default manifest;
