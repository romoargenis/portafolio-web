"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SplitText from "./SplitText";

export default function IntroSection({ slide }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
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
  // Complete the animation near the very end (95-98%)
  const rightSectionWidth = useTransform(
    scrollYProgress,
    [descriptionEndTime + 0.05, 0.98],
    ["50%", "100%"]
  );

  const leftSectionOpacity = useTransform(
    scrollYProgress,
    [descriptionEndTime + 0.05, descriptionEndTime + 0.15],
    [1, 0]
  );

  const containerMargin = useTransform(
    scrollYProgress,
    [descriptionEndTime + 0.05, 0.98],
    ["0px", "40px"]
  );

  const containerBorderRadius = useTransform(
    scrollYProgress,
    [descriptionEndTime + 0.05, 0.98],
    ["0px", "24px"]
  );

  return (
    <div ref={containerRef} className="h-[250vh] relative" style={{ backgroundColor: slide.color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="w-full h-full flex items-center justify-center gap-8 px-12"
          style={{
            margin: containerMargin,
          }}
        >
          {/* Left 50% - Title and Subtitle */}
          <motion.div 
            className="w-1/2 flex flex-col justify-center text-left pl-8 pr-12"
            style={{ opacity: leftSectionOpacity }}
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
            className="h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
            style={{
              width: rightSectionWidth,
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
