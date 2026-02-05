"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SplitText from "./SplitText";

export default function IntroSection({ slide }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const services = slide.services || [];
  const totalServices = services.length;

  // ── TITLE ──────────────────────────────────────────────────────────
  const titleWords = slide.title.split(" ");
  
  const getTitleWordOpacity = (index) => {
    const baseStart = 0.02;
    const staggerDelay = 0.02;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.04;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  // ── SUBTITLE ───────────────────────────────────────────────────────
  const subtitleWords = slide.subtitle.split(" ");
  
  const getSubtitleWordOpacity = (index) => {
    const baseStart = 0.04;
    const staggerDelay = 0.02;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.04;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  const getSubtitleWordY = (index) => {
    const baseStart = 0.04;
    const staggerDelay = 0.02;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.04;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [20, 0]
    );
  };

  const subtitleEndTime = 0.04 + (subtitleWords.length * 0.02) + 0.04;

  // ── SERVICES CAROUSEL (continuation of subtitle) ───────────────────
  // Each service gets an equal slice of the services window
  const servicesStart = subtitleEndTime + 0.02;
  const servicesWindow = 0.45; // total scroll budget for all services
  const servicesEnd = servicesStart + servicesWindow;
  const segmentSize = servicesWindow / totalServices;

  const getServiceOpacity = (index) => {
    const start = servicesStart + (index * segmentSize);
    const fadeIn = start + segmentSize * 0.15;
    const fadeOut = start + segmentSize * 0.85;
    const end = start + segmentSize;

    return useTransform(
      scrollYProgress,
      [start, fadeIn, fadeOut, end],
      [0, 1, 1, 0]
    );
  };

  const getServiceY = (index) => {
    const start = servicesStart + (index * segmentSize);
    const settleIn = start + segmentSize * 0.2;
    const settleOut = start + segmentSize * 0.8;
    const end = start + segmentSize;

    return useTransform(
      scrollYProgress,
      [start, settleIn, settleOut, end],
      [40, 0, 0, -40]
    );
  };

  // ── DESCRIPTION ────────────────────────────────────────────────────
  const descriptionStart = servicesEnd + 0.02;
  const descriptionOpacity = useTransform(
    scrollYProgress,
    [descriptionStart, descriptionStart + 0.06],
    [0, 1]
  );
  const descriptionEndTime = descriptionStart + 0.06;

  // ── EXPAND RIGHT SECTION TO FULL WIDTH ─────────────────────────────
  const expandStart = descriptionEndTime + 0.03;
  const expandEnd = 0.9;

  const leftSectionOpacity = useTransform(
    scrollYProgress,
    [expandStart, expandStart + 0.06],
    [1, 0]
  );

  const leftSectionWidth = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["50%", "0%"]
  );

  const containerGap = useTransform(
    scrollYProgress,
    [expandStart, expandEnd],
    ["32px", "0px"]
  );

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
    <div ref={containerRef} className="h-[500vh] relative" style={{ backgroundColor: slide.color }}>
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
          {/* Left 50% - Title, Subtitle & Services */}
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
            <p className="text-3xl opacity-90 flex flex-wrap gap-2 mb-8">
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

            {/* Services carousel - feels like a continuation of the subtitle */}
            {services.length > 0 && (
              <div className="relative h-16 flex items-center overflow-hidden">
                {services.map((service, index) => {
                  const serviceOpacity = getServiceOpacity(index);
                  const serviceY = getServiceY(index);
                  return (
                    <motion.span
                      key={index}
                      className="absolute text-2xl font-light opacity-70 whitespace-nowrap"
                      style={{
                        opacity: serviceOpacity,
                        y: serviceY,
                      }}
                    >
                      {service}
                    </motion.span>
                  );
                })}
              </div>
            )}
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
