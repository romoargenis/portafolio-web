"use client";

import { useRef, useState, useCallback } from "react";

/**
 * Two long screenshots (desktop + mobile) in one scroll container.
 * Mobile is shown at half size; both columns share the same content height
 * so overflow and scroll meet at the top and bottom.
 */
export default function ResponsiveScrollPair({ images, altLeft = "Desktop", altRight = "Mobile" }) {
  const [leftHeight, setLeftHeight] = useState(null);
  const leftRef = useRef(null);

  const onLeftLoad = useCallback(() => {
    if (leftRef.current) {
      setLeftHeight(leftRef.current.offsetHeight);
    }
  }, []);

  if (!images || images.length < 2) return null;
  const [leftSrc, rightSrc] = images;

  return (
    <div
      className="flex-shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10"
      style={{
        width: 520,
        maxHeight: "75vh",
        minHeight: 360,
      }}
    >
      {/* Single scroll container so both images scroll together; tops and bottoms align */}
      <div
        className="flex gap-3 p-2 overflow-y-auto overflow-x-hidden w-full [scrollbar-width:thin]"
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex-1 min-w-0 shrink-0 flex flex-col" style={{ maxWidth: "50%" }}>
          <img
            ref={leftRef}
            src={leftSrc}
            alt={altLeft}
            onLoad={onLeftLoad}
            className="w-full block object-top"
            style={{ minWidth: 0, verticalAlign: "top" }}
            draggable={false}
          />
        </div>
        <div
          className="flex-1 min-w-0 shrink-0 flex flex-col"
          style={{
            maxWidth: "50%",
            minHeight: leftHeight ?? undefined,
          }}
        >
          {/* Mobile at half size; column minHeight matches desktop so scroll meets at top and bottom */}
          <img
            src={rightSrc}
            alt={altRight}
            className="w-full block object-top"
            style={{
              minWidth: 0,
              verticalAlign: "top",
              width: "50%",
              height: "auto",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
