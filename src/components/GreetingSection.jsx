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
  // Stage 1: "Hi" fades in quickly
  const firstWordOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.10],
    [0, 1, 1]
  );

  // Stage 2: "[Client Name]" fades in right after
  const clientNameOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.10, 0.18],
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
  
  // Stage 3: Subtitle fades in after the pause
  const getWordOpacity = (index) => {
    const baseStart = 0.35;
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
  const margin = useTransform(
    scrollYProgress,
    [zoomStart, zoomEnd],
    ["0px", "40px"]
  );
  
  // Border radius for zoom effect
  const borderRadius = useTransform(
    scrollYProgress,
    [zoomStart, zoomEnd],
    ["0px", "24px"]
  );

  return (
    <div ref={containerRef} className="h-[300vh] relative" style={{ backgroundColor: color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            margin,
            borderRadius,
            backgroundColor: "rgb(24, 24, 24)",
          }}
        >
          {/* Background circle */}
          <HiCircle />
          
          {/* Title container */}
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold mb-4 flex items-baseline justify-center">
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
                <span className="pl-4 inline-block">{clientName}</span>
              </motion.div>
            </div>
            
            {/* Subtitle with staggered words */}
            <div className="text-2xl flex items-center justify-center gap-2 flex-wrap">
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
