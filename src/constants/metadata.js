const defaultBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://questit.vesit.ves.ac.in"
    : "http://localhost:3000");

const metadataBase = new URL(defaultBaseUrl);

// Only noindex on the personal Vercel deployment, not on the official domain
const isVercelPersonalDeploy =
  String(process.env.NEXT_PUBLIC_BASE_URL || "").includes("vercel.app");

const noIndexIfVercel = isVercelPersonalDeploy
  ? { robots: { index: false, follow: false } }
  : {};

const root = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT VESIT",
    title: "QuestIT VESIT | Official IT Cell of VES Institute of Technology Mumbai",
    description:
      "Official website of QuestIT - IT Cell of VESIT Mumbai. Technical events, workshops, hackathons, and competitions for students. Join VESIT's premier IT community.",
  },
  creator: "QuestIT VESIT",
  generator: "Next.js",
  publisher: "QuestIT - VES Institute of Technology",
  applicationName: "QuestIT VESIT",
  title: "QuestIT VESIT | Official IT Cell of VES Institute of Technology Mumbai",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
    { name: "Atharva Lotankar", url: "https://github.com/AtharvaLotankar11" },
    { name: "Pranav Titambe", url: "https://github.com/Pranavlovescode" },
  ],
  description:
    "Official website of QuestIT - IT Cell of VESIT Mumbai. Technical events, workshops, hackathons, and competitions for students. Join VESIT's premier IT community.",
  keywords: [
    "QuestIT",
    "QuestIT VESIT",
    "Quest IT VESIT",
    "VESIT QuestIT",
    "IT Cell VESIT",
    "IT Council VESIT",
    "VESIT Mumbai",
    "VESIT IT Department",
    "VES Institute of Technology",
    "Vivekanand Education Society",
    "VESIT Chembur",
    "Mumbai Engineering College",
    "Technical Events VESIT",
    "IT Events Mumbai",
    "College Tech Events Mumbai",
    "VESIT Technical Cell",
    "IT Workshops Mumbai",
    "Hackathons Mumbai",
    "Technical Fest VESIT",
    "Student Tech Community Mumbai",
    "VESIT Student Activities",
    "Engineering College Mumbai",
    "Technical Competitions",
    "Skill Development",
    "IT Innovation",
    "VESIT IT Community",
    "Technology VESIT",
    "Technical Leadership",
    "Student Collaboration",
    "Workshops and Hackathons",
  ],
};

const team = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/team",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT",
    title: "Team | QuestIT | The Pulse of IT at VESIT",
    description:
      "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  },
  creator: "QuestIT",
  generator: "Next.js",
  publisher: "QuestIT",
  applicationName: "QuestIT",
  title: "Team | QuestIT | The Pulse of IT at VESIT",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
  ],
  description:
    "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  keywords: [
    "QuestIT",
    "IT Competitions",
    "IT Council VESIT",
    "Fun and Learning",
    "Technical Events",
    "Skill Development",
    "IT Innovation Hub",
    "VESIT IT Community",
    "VESIT IT Department",
    "Technology at VESIT",
    "Technical Leadership",
    "VESIT Technical Cell",
    "Technical Excellence",
    "Non-Technical Events",
    "Student Collaboration",
    "Innovation and Growth",
    "Workshops and Hackathons",
    "Creative Problem-Solving",
    "Student Learning Platform",
  ],
};

const events = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/events",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT",
    title: "Events | QuestIT | The Pulse of IT at VESIT",
    description:
      "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  },
  creator: "QuestIT",
  generator: "Next.js",
  publisher: "QuestIT",
  applicationName: "QuestIT",
  title: "Events | QuestIT | The Pulse of IT at VESIT",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
  ],
  description:
    "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  keywords: [
    "QuestIT",
    "IT Competitions",
    "IT Council VESIT",
    "Fun and Learning",
    "Technical Events",
    "Skill Development",
    "IT Innovation Hub",
    "VESIT IT Community",
    "VESIT IT Department",
    "Technology at VESIT",
    "Technical Leadership",
    "VESIT Technical Cell",
    "Technical Excellence",
    "Non-Technical Events",
    "Student Collaboration",
    "Innovation and Growth",
    "Workshops and Hackathons",
    "Creative Problem-Solving",
    "Student Learning Platform",
  ],
};

const developers = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/developers",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT",
    title: "Developers | QuestIT | The Pulse of IT at VESIT",
    description:
      "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  },
  creator: "QuestIT",
  generator: "Next.js",
  publisher: "QuestIT",
  applicationName: "QuestIT",
  title: "Developers | QuestIT | The Pulse of IT at VESIT",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
  ],
  description:
    "QuestIT offers VESIT students a platform to learn, compete, and enjoy through a wide range of technical and non-technical events, fostering growth, collaboration, and innovation.",
  keywords: [
    "QuestIT",
    "IT Competitions",
    "IT Council VESIT",
    "Fun and Learning",
    "Technical Events",
    "Skill Development",
    "IT Innovation Hub",
    "VESIT IT Community",
    "VESIT IT Department",
    "Technology at VESIT",
    "Technical Leadership",
    "VESIT Technical Cell",
    "Technical Excellence",
    "Non-Technical Events",
    "Student Collaboration",
    "Innovation and Growth",
    "Workshops and Hackathons",
    "Creative Problem-Solving",
    "Student Learning Platform",
  ],
};

const registration = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/registration",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/registration",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT",
    title: "Registration | QuestIT | The Pulse of IT at VESIT",
    description:
      "Register for QuestIT workshops and events. Join VESIT's premier IT community for technical learning, competitions, and innovation.",
  },
  creator: "QuestIT",
  generator: "Next.js",
  publisher: "QuestIT",
  applicationName: "QuestIT",
  title: "Registration | QuestIT | The Pulse of IT at VESIT",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
  ],
  description:
    "Register for QuestIT workshops and events. Join VESIT's premier IT community for technical learning, competitions, and innovation.",
  keywords: [
    "QuestIT Registration",
    "VESIT Workshop Registration",
    "IT Events Registration",
    "QuestIT Cell Registration",
    "Technical Workshop VESIT",
    "Student Registration",
    "IT Department Events",
    "VESIT IT Community",
    "Workshop Sign Up",
    "Event Registration",
  ],
};

const feedback = {
  ...noIndexIfVercel,
  alternates: {
    canonical: "/feedback",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  twitter: {
    creator: "@QuestIT_Vesit",
    card: "summary_large_image",
  },
  openGraph: {
    images: [
      {
        sizes: "1200x630",
        type: "image/png",
        url: "/images/opengraph-image.png",
      },
    ],
    url: "/feedback",
    locale: "en_IN",
    type: "website",
    siteName: "QuestIT",
    title: "Feedback | QuestIT | The Pulse of IT at VESIT",
    description:
      "Share your feedback on QuestIT workshops and events. Help us improve and create better learning experiences for the VESIT IT community.",
  },
  creator: "QuestIT",
  generator: "Next.js",
  publisher: "QuestIT",
  applicationName: "QuestIT",
  title: "Feedback | QuestIT | The Pulse of IT at VESIT",
  metadataBase,
  authors: [
    { name: "Jay Kerkar", url: "https://github.com/jaykerkar0405" },
    { name: "Anish Tawade", url: "https://github.com/Anissh280507" },
  ],
  description:
    "Share your feedback on QuestIT workshops and events. Help us improve and create better learning experiences for the VESIT IT community.",
  keywords: [
    "QuestIT Feedback",
    "Workshop Feedback",
    "Event Feedback",
    "VESIT IT Feedback",
    "Student Feedback",
    "Workshop Review",
    "Event Review",
    "QuestIT Survey",
    "Workshop Evaluation",
    "Event Satisfaction",
  ],
};

export { root, team, events, developers, registration, feedback };
