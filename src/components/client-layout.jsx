"use client";

// React's Imports
import { useState, useEffect } from "react";

// Next's Imports
import { usePathname } from "next/navigation";

// App's Internal Imports
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ScrollToTop, CookieConsent } from "@/components/utils";

// App's External Imports
import NextTopLoader from "nextjs-toploader";
import { getCookie, hasCookie } from "cookies-next/client";

const ClientLayout = ({ children }) => {
  const [is_cookie_consent_given, set_is_cookie_consent_given] = useState(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const cookie_consent = hasCookie("cookie_consent");

    if (cookie_consent) {
      const consent_value = getCookie("cookie_consent") === "true";
      set_is_cookie_consent_given(consent_value);
    } else {
      set_is_cookie_consent_given(null);
    }
  }, []);

  return (
    <>
      <NextTopLoader zIndex={10500} color="#00FAFF" showSpinner={false} />
      {!isAdminRoute && <Header />}
      {children}
      {is_cookie_consent_given === null && <CookieConsent />}
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </>
  );
};

export default ClientLayout;
