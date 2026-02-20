"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

// Scroll-driven child components for variable-length lists (safe from hooks-in-loops)
function ScrollFadeWord({ scrollYProgress, start, duration = 0.03, style, children }) {
  const opacity = useTransform(scrollYProgress, [start, start + duration], [0, 1]);
  return (
    <motion.span style={{ opacity, ...style }}>
      {children}
    </motion.span>
  );
}

function ServiceItem({ scrollYProgress, start, segmentSize, isLast, className, children }) {
  const fadeIn = start + segmentSize * 0.15;
  const fadeOut = start + segmentSize * 0.85;
  const end = start + segmentSize;
  const settleIn = start + segmentSize * 0.2;
  const settleOut = start + segmentSize * 0.8;

  const opacity = useTransform(
    scrollYProgress,
    isLast ? [start, fadeIn] : [start, fadeIn, fadeOut, end],
    isLast ? [0, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    isLast ? [start, settleIn] : [start, settleIn, settleOut, end],
    isLast ? [40, 0] : [40, 0, 0, -40]
  );

  return (
    <motion.span className={className} style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

export default function IntroSection({ slide }) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const services = slide.services || [];
  const totalServices = services.length;
  const titleWords = slide.title.split(" ");
  const subtitleWords = slide.subtitle.split(" ");

  // ── TIMING (scroll-driven phases still need these) ──────────────────
  const titleEndApprox = 0.02 + (titleWords.length * 0.02) + 0.04;
  const subtitleEndTime = titleEndApprox + (subtitleWords.length * 0.02) + 0.04;

  const description = slide.description || [];
  const descLine1 = Array.isArray(description) ? description[0] : description;
  const descLine2 = Array.isArray(description) ? description[1] : null;
  const descLine2Words = descLine2 ? descLine2.split(" ") : [];

  // ── AWARD TEXT (staggered, scroll-driven, fixed count) ──────────────
  const descriptionStart = subtitleEndTime + 0.12;
  const desc1Opacity = useTransform(
    scrollYProgress,
    [descriptionStart, descriptionStart + 0.06],
    [0, 1]
  );

  const AWARD_STAGGER = 0.03;
  const awardLine0Opacity = useTransform(
    scrollYProgress,
    [descriptionStart, descriptionStart + 0.04],
    [0, 1]
  );
  const awardLine1Opacity = useTransform(
    scrollYProgress,
    [descriptionStart + AWARD_STAGGER, descriptionStart + AWARD_STAGGER + 0.04],
    [0, 1]
  );
  const awardOverlayOpacity = useTransform(
    scrollYProgress,
    [descriptionStart + AWARD_STAGGER * 2, descriptionStart + AWARD_STAGGER * 2 + 0.04],
    [0, 1]
  );
  const awardLineOpacities = [awardLine0Opacity, awardLine1Opacity];

  // ── LEFT PANEL COLLAPSE ─────────────────────────────────────────────
  const desc1EndTime = descriptionStart + AWARD_STAGGER * 2 + 0.04;
  const expandStart = desc1EndTime + 0.03;
  const expandEnd = expandStart + 0.15;

  // ── DESC LINE 2 + SERVICES (scroll-driven, variable count) ─────────
  const desc2Start = expandEnd + 0.02;
  const desc2Stagger = 0.01;
  const desc2EndTime = desc2Start + (descLine2Words.length * desc2Stagger) + 0.03;

  const servicesStart = desc2EndTime + 0.02;
  const servicesWindow = 0.92 - servicesStart;
  const segmentSize = totalServices > 0 ? servicesWindow / totalServices : 0;

  // ── LAYOUT TRANSFORMS ──────────────────────────────────────────────
  const leftSectionOpacity = useTransform(scrollYProgress, [expandStart, expandStart + 0.06], [1, 0]);
  const leftSectionWidthDesktop = useTransform(scrollYProgress, [expandStart, expandEnd], ["50%", "0%"]);
  const leftSectionWidthMobile = useTransform(scrollYProgress, [expandStart, expandEnd], ["100%", "0%"]);
  const containerGap = useTransform(scrollYProgress, [expandStart, expandEnd], ["32px", "0px"]);

  // whileInView delay helpers
  const WORD_DELAY = 0.07;
  const subtitleOffset = titleWords.length * WORD_DELAY + 0.1;

  return (
    <div ref={containerRef} className="h-[800vh] relative" style={{ backgroundColor: slide.color }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          style={{
            scale: isMobile ? 1 : 0.9,
            gap: containerGap,
            borderRadius: isMobile ? "0px" : "24px",
          }}
        >
          {/* Left section - Title & Subtitle (simple whileInView stagger) */}
          <motion.div
            className="flex flex-col justify-center px-5 text-left md:pl-8 md:pr-12 overflow-hidden flex-shrink-0 h-full"
            style={{
              opacity: leftSectionOpacity,
              width: isMobile ? leftSectionWidthMobile : leftSectionWidthDesktop,
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3">
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * WORD_DELAY, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="text-lg sm:text-xl md:text-3xl opacity-90 flex flex-wrap gap-1.5 md:gap-2">
              {subtitleWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: subtitleOffset + index * WORD_DELAY, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Right section - Image background with description */}
          <motion.div
            className="h-full rounded-2xl md:rounded-3xl overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex-1 min-w-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/img/Whiteflag.jpg')" }}
            />

            <div className="relative z-10 h-full w-full flex flex-col justify-center items-center p-4 md:p-8">
              {descLine1 && (
                typeof descLine1 === 'object' && descLine1.type === 'award-layout' ? (
                  <div className="flex flex-col items-center justify-center relative">
                    <motion.span
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8.6vw] md:text-[5.1vw] xl:text-[120px] tracking-[0.2em] font-[family-name:var(--font-bebas-neue)] uppercase z-20 text-[#333] whitespace-nowrap"
                      style={{ opacity: awardOverlayOpacity }}
                    >
                      {descLine1.overlay}
                    </motion.span>
                    <div className="flex flex-col items-center leading-[0.8] z-10">
                      {descLine1.lines.map((line, idx) => (
                        <motion.span
                          key={idx}
                          className="text-[20vw] md:text-[12vw] xl:text-[280px] font-[family-name:var(--font-pirata-one)] text-white"
                          style={{ opacity: awardLineOpacities[idx] || desc1Opacity }}
                        >
                          {line}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.p
                    className="text-base md:text-lg leading-relaxed text-center"
                    style={{ opacity: desc1Opacity }}
                  >
                    {descLine1}
                  </motion.p>
                )
              )}

              {/* Desc line 2 + services carousel (scroll-driven) */}
              <div className="absolute bottom-6 md:bottom-16 left-0 right-0 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-[#333] px-4">
                {descLine2Words.length > 0 && (
                  <p className="text-sm sm:text-base md:text-xl leading-relaxed font-medium">
                    {descLine2Words.map((word, index) => (
                      <ScrollFadeWord
                        key={index}
                        scrollYProgress={scrollYProgress}
                        start={desc2Start + index * desc2Stagger}
                        style={{ display: "inline-block", marginRight: "0.25em" }}
                      >
                        {word}
                      </ScrollFadeWord>
                    ))}
                  </p>
                )}

                {services.length > 0 && (
                  <div className="relative h-8 md:h-12 w-48 md:w-64 overflow-hidden flex items-center">
                    {services.map((service, index) => (
                      <ServiceItem
                        key={index}
                        scrollYProgress={scrollYProgress}
                        start={servicesStart + index * segmentSize}
                        segmentSize={segmentSize}
                        isLast={index === totalServices - 1}
                        className="absolute left-0 text-sm sm:text-base md:text-xl font-bold whitespace-nowrap"
                      >
                        {service}
                      </ServiceItem>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
