"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Poster first (it is the LCP element). The video only loads after the page
 * has loaded, and never on Save-Data or reduced-motion.
 */
export function HeroVideo({ mp4, webm, poster, alt }: { mp4: string; webm?: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (conn?.saveData || reduce) return;
    const start = () => setEnabled(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- poster must be preloaded & high priority */}
      <img src={poster} alt={alt} fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      {enabled && (
        <video
          ref={ref}
          className="absolute inset-0 size-full scale-[1.04] object-cover motion-safe:animate-[unzoom_10s_ease-out_forwards]"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </>
  );
}
