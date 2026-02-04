"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,
        duration: 0.8,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
