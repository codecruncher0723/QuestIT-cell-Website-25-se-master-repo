"use client";

import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/about"), { ssr: false });
const Events = dynamic(
  () =>
    import("@/components/events").then((module) => ({
      default: module.Events,
    })),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import("@/components/testimonials"),
  { ssr: false }
);
const Contact = dynamic(() => import("@/components/contact"), { ssr: false });

const HomeSections = () => (
  <>
    <About />
    <Events featured />
    <Testimonials />
    <Contact />
  </>
);

export default HomeSections;
