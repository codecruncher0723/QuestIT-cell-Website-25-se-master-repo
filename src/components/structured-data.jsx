/**
 * Structured Data Component for SEO
 * Adds JSON-LD schema markup for better search engine understanding
 */

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "QuestIT - IT Cell of VESIT",
    alternateName: ["QuestIT", "Quest IT VESIT", "VESIT IT Cell"],
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://questit-cell-website.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://questit-cell-website.vercel.app"}/images/logo.webp`,
    description: "Official IT Cell of VES Institute of Technology, Mumbai. We organize technical events, workshops, hackathons, and competitions for students.",
    foundingDate: "2000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hashu Advani Memorial Complex, Collector's Colony",
      addressLocality: "Chembur",
      addressRegion: "Maharashtra",
      postalCode: "400074",
      addressCountry: "IN"
    },
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "VES Institute of Technology",
      alternateName: "VESIT",
      url: "https://ves.ac.in"
    },
    sameAs: [
      "https://twitter.com/QuestIT_Vesit",
      "https://www.instagram.com/questit_vesit/",
      "https://www.linkedin.com/company/questit-vesit/"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Inquiries",
      email: "questit@ves.ac.in"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "QuestIT VESIT",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://questit-cell-website.vercel.app",
    description: "Official website of QuestIT - IT Cell of VES Institute of Technology, Mumbai",
    publisher: {
      "@type": "Organization",
      name: "QuestIT VESIT"
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://questit-cell-website.vercel.app"}/events?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const educationalOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "QuestIT - IT Cell of VESIT",
    description: "Student-run technical organization at VES Institute of Technology providing learning opportunities through workshops, hackathons, and technical events.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://questit-cell-website.vercel.app",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganizationSchema) }}
      />
    </>
  );
};

export default StructuredData;
