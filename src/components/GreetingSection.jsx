"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HiCircle from "./HiCircle";

export default function GreetingSection({ title, subtitle, color }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Map progress so 1.0 happens when the sticky should release (container end hits viewport end).
    // Using "end start" makes the animation finish ~1 viewport too late for sticky compositions.
    offset: ["start start", "end end"],
  });

  // Split title into first word and client name
  const words = title.split(" ");
  const firstWord = words[0];
  const clientName = words.slice(1).join(" ");

  // Animation progress for different stages
  // Stage 1: Scroll cue is visible, then fades; greeting comes after
  // Delay "Hi" so the instruction appears first
  const firstWordOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.28, 0.40],
    [0, 1, 1]
  );

  // Stage 2: "[Client Name]" fades in after "Hi"
  const clientNameOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.44, 0.58],
    [0, 1, 1]
  );

  // Client name width expands in sync so the layout re-centers smoothly
  const clientNameMaxWidth = useTransform(
    scrollYProgress,
    [0.06, 0.10],
    ["0px", "600px"]
  );

  // ── PAUSE ── 0.18 → 0.35 — let "Hi [Client Name]" breathe ──────────

  // Split subtitle into words for stagger
  const subtitleWords = subtitle.split(" ");
  
  // Stage 3: Subtitle fades in after the greeting
  const getWordOpacity = (index) => {
    const baseStart = 0.60;
    const staggerDelay = 0.025;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.05;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  // Calculate when subtitle finishes
  const subtitleEndTime = 0.35 + (subtitleWords.length * 0.025) + 0.05;
  
  // ── PAUSE ── small hold after subtitle before zoom ──────────────────
  // Zoom out effect: eases into the next section
  const zoomStart = subtitleEndTime + 0.08;
  const zoomEnd = 0.88;
  
  const scale = useTransform(
    scrollYProgress,
    [zoomStart, zoomEnd],
    [1, 0.9]
  );
  
  // Border radius for zoom effect
  const borderRadius = useTransform(
    scrollYProgress,
    [zoomStart, zoomEnd],
    ["0px", "24px"]
  );
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.30],
    [1, 1, 0]
  );

  return (
    <div ref={containerRef} className="h-[300vh] relative" style={{ backgroundColor: color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            scale,
            borderRadius,
            backgroundColor: "rgb(24, 24, 24)",
          }}
        >
          {/* Background circle */}
          <HiCircle />

          {/* Scroll cue – fixed to bottom of viewport */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-1 text-[0.65rem] tex-xs sm:text-xs md:text-sm text-neutral-300 pointer-events-none"
            style={{ opacity: scrollHintOpacity }}
          >
            <span className="uppercase tracking-[0.25em]">
              Scroll down, don&apos;t be shy.
            </span>
            {/* <motion.div
              className="w-px h-6 sm:h-7 md:h-8 bg-neutral-500/60 overflow-hidden"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-px h-6 sm:h-7 md:h-8 bg-neutral-100" />
            </motion.div> */}
          </motion.div>
          
          {/* Title container */}
          <div className="relative z-10 text-center px-6 md:px-8 max-w-full">
            <div className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 flex items-baseline justify-center">
              {/* First word - always centered */}
              <motion.span
                style={{ opacity: firstWordOpacity }}
              >
                {firstWord}
              </motion.span>
              
              {/* Client name - width expands so layout re-centers */}
              <motion.div
                className="overflow-hidden whitespace-nowrap"
                style={{
                  opacity: clientNameOpacity,
                  maxWidth: clientNameMaxWidth,
                }}
              >
                <span className="pl-2 sm:pl-4 inline-block">{clientName}</span>
              </motion.div>
            </div>
            
            {/* Subtitle with staggered words */}
            <div className="text-base sm:text-xl md:text-2xl flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {subtitleWords.map((word, index) => {
                const wordOpacity = getWordOpacity(index);
                return (
                  <motion.span
                    key={index}
                    style={{ opacity: wordOpacity }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
