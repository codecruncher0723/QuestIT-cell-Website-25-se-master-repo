// Next's Imports
import dynamic from "next/dynamic";

// App's Internal Imports
import "./globals.css";
import poppins from "./font";
import { root } from "@/constants/metadata";
import StructuredData from "@/components/structured-data";
import DeferredAnalytics from "@/components/deferred-analytics";
const ClientLayout = dynamic(() => import("@/components/client-layout"));

// Export metadata for SEO
export const metadata = root;

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className={`antialiased ${poppins.className} overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
        {process.env.NODE_ENV !== "development" && (
          <DeferredAnalytics />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
