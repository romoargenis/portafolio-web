"use client";

import { useRef, useEffect } from "react";

export default function HorizontalScrollSection({ children, isProject }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!isProject) return;

    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      const container = section.querySelector('.horizontal-scroll-container');
      if (!container) return;

      // Check if we're in the viewport
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!isInView) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      // If scrolling down and haven't reached the end
      if (e.deltaY > 0 && currentScroll < maxScrollLeft) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
      // If scrolling up and not at the start
      else if (e.deltaY < 0 && currentScroll > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isProject]);

  return (
    <div ref={sectionRef} className="horizontal-scroll-wrapper">
      {children}
    </div>
  );
}
