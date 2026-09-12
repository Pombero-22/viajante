"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const utmSource = searchParams.get("utm_source");
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      utmSource,
    });

    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-visit", blob);
    } else {
      fetch("/api/track-visit", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
