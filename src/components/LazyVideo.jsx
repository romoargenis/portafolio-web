"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Video that only loads src when it enters (or nears) the viewport.
 * Uses IntersectionObserver to defer loading until the element is visible.
 */
export default function LazyVideo({
  src,
  className = "",
  rootMargin = "200px",
  threshold = 0.01,
  ...props
}) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            return;
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, rootMargin, threshold]);

  return (
    <div ref={containerRef} className="w-full h-full min-w-0 min-h-0">
      {shouldLoad ? (
        <video src={src} className={className} preload="none" {...props} />
      ) : (
        <div className="w-full h-full min-w-0 min-h-0 bg-white/5" />
      )}
    </div>
  );
}
