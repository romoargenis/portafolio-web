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

  // ── SUBTITLE (part of the same motion as title) ────────────────────
  const subtitleWords = slide.subtitle.split(" ");
  const titleEndApprox = 0.02 + (titleWords.length * 0.02) + 0.04;
  
  const getSubtitleWordOpacity = (index) => {
    const baseStart = titleEndApprox;
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
    const baseStart = titleEndApprox;
    const staggerDelay = 0.02;
    const wordStart = baseStart + (index * staggerDelay);
    const wordEnd = wordStart + 0.04;
    
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [20, 0]
    );
  };

  const subtitleEndTime = titleEndApprox + (subtitleWords.length * 0.02) + 0.04;

  // ── PAUSE ── let the layout (image + text) breathe ─────────────────

  // ── DESCRIPTION (two segments) ──────────────────────────────────────
  const description = slide.description || [];
  const descLine1 = Array.isArray(description) ? description[0] : description;
  const descLine2 = Array.isArray(description) ? description[1] : null;
  const descLine2Words = descLine2 ? descLine2.split(" ") : [];

  // Line 1 "Award winning designer," fades in after a deliberate pause
  const descriptionStart = subtitleEndTime + 0.12;
  const desc1Opacity = useTransform(
    scrollYProgress,
    [descriptionStart, descriptionStart + 0.06],
    [0, 1]
  );
  const desc1EndTime = descriptionStart + 0.06;

  // ── EXPAND RIGHT SECTION TO FULL WIDTH ─────────────────────────────
  const expandStart = desc1EndTime + 0.03;
  const expandEnd = expandStart + 0.15;

  // Line 2 fades in word-by-word (after expansion, tighter stagger)
  const desc2Start = expandEnd + 0.02;
  const desc2StaggerDelay = 0.01;

  const getDesc2WordOpacity = (index) => {
    const wordStart = desc2Start + (index * desc2StaggerDelay);
    const wordEnd = wordStart + 0.03;
    return useTransform(
      scrollYProgress,
      [wordStart, wordEnd],
      [0, 1]
    );
  };

  const desc2EndTime = desc2Start + (descLine2Words.length * desc2StaggerDelay) + 0.03;

  // ── SERVICES CAROUSEL (after desc line 2, full-width panel) ────────
  const servicesStart = desc2EndTime + 0.02;
  const servicesWindow = 0.92 - servicesStart; // fill remaining scroll budget (hold at end)
  const servicesEnd = servicesStart + servicesWindow;
  const segmentSize = servicesWindow / totalServices;

  const isLastService = (index) => index === totalServices - 1;

  const getServiceOpacity = (index) => {
    const start = servicesStart + (index * segmentSize);
    const fadeIn = start + segmentSize * 0.15;

    if (isLastService(index)) {
      // Last service fades in and STAYS
      return useTransform(
        scrollYProgress,
        [start, fadeIn],
        [0, 1]
      );
    }

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

    if (isLastService(index)) {
      // Last service settles and STAYS
      return useTransform(
        scrollYProgress,
        [start, settleIn],
        [40, 0]
      );
    }

    const settleOut = start + segmentSize * 0.8;
    const end = start + segmentSize;
    return useTransform(
      scrollYProgress,
      [start, settleIn, settleOut, end],
      [40, 0, 0, -40]
    );
  };

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

  return (
    <div ref={containerRef} className="h-[800vh] relative" style={{ backgroundColor: slide.color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          style={{
            scale: 0.9,
            gap: containerGap,
            borderRadius: "24px",
          }}
        >
          {/* Left 50% - Title, Subtitle & Services */}
          <motion.div 
            className="flex flex-col justify-center text-left pl-8 pr-12 overflow-hidden flex-shrink-0 h-full"
            style={{ 
              opacity: leftSectionOpacity, 
              width: leftSectionWidth, 
            }}
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
            className="h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex-1 min-w-0"
          >
            {/* Placeholder background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop')"
              }}
            />
            
            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
              {/* Description - Line 1 (fades in as block) */}
              {descLine1 && (
                typeof descLine1 === 'object' && descLine1.type === 'award-layout' ? (
                  <motion.div 
                    className="flex flex-col items-center relative"
                    style={{ opacity: desc1Opacity }}
                  >
                    <span className="text-2xl tracking-[0.2em] font-light uppercase z-10 mix-blend-difference mb-[-4rem]">
                      {descLine1.overlay}
                    </span>
                    <div className="flex flex-col items-center leading-[0.8]">
                      {descLine1.lines.map((line, idx) => (
                        <span 
                          key={idx}
                          className="text-[12vw] xl:text-[280px] font-[family-name:var(--font-pirata-one)] text-white"
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.p 
                    className="text-lg leading-relaxed text-center"
                    style={{ opacity: desc1Opacity }}
                  >
                    {descLine1}
                  </motion.p>
                )
              )}

              {/* Description - Line 2 (word-by-word stagger) */}
              {descLine2Words.length > 0 && (
                <p className="text-lg leading-relaxed text-center mt-1">
                  {descLine2Words.map((word, index) => {
                    const wordOpacity = getDesc2WordOpacity(index);
                    return (
                      <motion.span
                        key={index}
                        style={{ opacity: wordOpacity, display: "inline-block", marginRight: "0.25em" }}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </p>
              )}

              {/* Services carousel - continuation of the description "like:" */}
              {services.length > 0 && (
                <div className="relative h-14 w-full flex items-center justify-center overflow-hidden mt-4">
                  {services.map((service, index) => {
                    const serviceOpacity = getServiceOpacity(index);
                    const serviceY = getServiceY(index);
                    return (
                      <motion.span
                        key={index}
                        className="absolute text-3xl font-semibold whitespace-nowrap"
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
