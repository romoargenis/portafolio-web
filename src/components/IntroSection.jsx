"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SplitText from "./SplitText";

export default function IntroSection({ slide }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Ensure progress completes while the sticky composition is still on-screen.
    offset: ["start start", "end end"],
  });

  // Split title into words for stagger
  const titleWords = slide.title.split(" ");
  
  // Create opacity transforms for each title word with stagger
  const getTitleWordOpacity = (index) => {
    const baseStart = 0.05;
    const staggerDelay = 0.04;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.08;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  // Split subtitle into words for stagger
  const subtitleWords = slide.subtitle.split(" ");
  
  // Calculate when title finishes
  const titleEndTime = 0.05 + (titleWords.length * 0.04) + 0.08;
  
  // Create opacity and y transforms for each subtitle word with stagger
  // Start slightly after title starts
  const getSubtitleWordOpacity = (index) => {
    const baseStart = 0.08;
    const staggerDelay = 0.035;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.08;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  const getSubtitleWordY = (index) => {
    const baseStart = 0.08;
    const staggerDelay = 0.035;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.08;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [20, 0]
    );
  };

  // Calculate when subtitle finishes
  const subtitleEndTime = 0.08 + (subtitleWords.length * 0.035) + 0.08;
  
  // Description starts fading in when visible (after subtitle)
  const descriptionOpacity = useTransform(
    scrollYProgress,
    [subtitleEndTime, subtitleEndTime + 0.1],
    [0, 1]
  );

  // Calculate when description finishes
  const descriptionEndTime = subtitleEndTime + 0.1;
  
  // After description is done, expand to full width with margins
  // Complete before the sticky releases, then "hold" the final state until the end.
  // This avoids users hitting the next section while the expansion is still happening.
  const expandStart = descriptionEndTime + 0.05;
  const expandEnd = 0.9;
  const rightSectionWidth = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["50%", "100%"]
  );

  const leftSectionOpacity = useTransform(
    scrollYProgress,
    [expandStart, expandStart + 0.1],
    [1, 0]
  );

  // Collapse the left section so the right can truly fill 100%
  const leftSectionWidth = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["50%", "0%"]
  );

  // Collapse the flex gap so it doesn't eat space
  const containerGap = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["32px", "0px"]
  );

  // Collapse outer padding so the right section can be edge-to-edge (minus margin)
  const containerPadding = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["48px", "0px"]
  );

  const containerMargin = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["0px", "40px"]
  );

  const containerBorderRadius = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["0px", "24px"]
  );

  return (
    <div ref={containerRef} className="h-[300vh] relative" style={{ backgroundColor: slide.color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          style={{
            margin: containerMargin,
            gap: containerGap,
            paddingLeft: containerPadding,
            paddingRight: containerPadding,
          }}
        >
          {/* Left 50% - Title and Subtitle */}
          <motion.div 
            className="flex flex-col justify-center text-left pl-8 pr-12 overflow-hidden flex-shrink-0"
            style={{ opacity: leftSectionOpacity, width: leftSectionWidth }}
          >
            {/* Title with staggered fade in */}
            <h1 className="text-6xl font-bold mb-6 flex flex-wrap gap-3">
              {titleWords.map((word, index) => {
                const wordOpacity = getTitleWordOpacity(index);
                return (
                  <motion.span
                    key={index}
                    style={{ opacity: wordOpacity }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>
            
            {/* Subtitle with staggered fade in + vertical slide */}
            <p className="text-3xl opacity-90 flex flex-wrap gap-2">
              {subtitleWords.map((word, index) => {
                const wordOpacity = getSubtitleWordOpacity(index);
                const wordY = getSubtitleWordY(index);
                return (
                  <motion.span
                    key={index}
                    style={{ 
                      opacity: wordOpacity,
                      y: wordY
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
          </motion.div>
          
          {/* Right 50% - Image background with description */}
          <motion.div 
            className="h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 flex-1 min-w-0"
            style={{
              borderRadius: containerBorderRadius,
            }}
          >
            {/* Placeholder background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop')"
              }}
            />
            
            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8">
              {/* Description */}
              {slide.description && (
                <motion.div 
                  className="text-6xl font-light flex items-center justify-center"
                  style={{ opacity: descriptionOpacity }}
                >
                  <SplitText 
                    text={slide.description} 
                    className="text-lg leading-relaxed text-center"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
