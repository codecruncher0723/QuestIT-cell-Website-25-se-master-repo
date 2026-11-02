"use client";

import { useEffect, useState } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

const DeferredAnalytics = () => {
  const [should_load, set_should_load] = useState(false);

  useEffect(() => {
    const timeout_id = window.setTimeout(() => set_should_load(true), 2500);
    return () => window.clearTimeout(timeout_id);
  }, []);

  if (!should_load) return null;

  return (
    <GoogleTagManager
      gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
    />
  );
};

export default DeferredAnalytics;
