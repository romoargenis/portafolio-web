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
  // Stage 1: First word fades in quickly (0 - 0.08) - SNAPPY
  const firstWordOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.12],
    [0, 1, 1]
  );

  // Stage 2: Client name fades in quickly (0.08 - 0.16) - SNAPPY
  const clientNameOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.12, 0.2],
    [0, 1, 1]
  );

  // Split subtitle into words for stagger
  const subtitleWords = subtitle.split(" ");
  
  // Create opacity transforms for each subtitle word with stagger
  const getWordOpacity = (index) => {
    const baseStart = 0.22; // Start after title is fully revealed (snappier)
    const staggerDelay = 0.03;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.06;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  // Calculate when subtitle finishes
  const subtitleEndTime = 0.22 + (subtitleWords.length * 0.03) + 0.06;
  
  // Zoom out effect: margins increase AFTER subtitle is done
  // Complete before the sticky releases, then "hold" the final state until the end.
  // This avoids users hitting the next section while the zoom is still happening.
  const zoomStart = subtitleEndTime + 0.06;
  const zoomEnd = 0.9;
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
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Background circle */}
          <HiCircle />
          
          {/* Title container */}
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              {/* First word - always centered */}
              <motion.span
                style={{ opacity: firstWordOpacity }}
              >
                {firstWord}
              </motion.span>
              
              {/* Client name - fades in */}
              <motion.span
                style={{ opacity: clientNameOpacity }}
              >
                {clientName}
              </motion.span>
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
