"use client";

import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import HiCircle from "@/components/HiCircle";
import HorizontalProject from "@/components/HorizontalProject";
import SplitText from "@/components/SplitText";
import GreetingSection from "@/components/GreetingSection";
import IntroSection from "@/components/IntroSection";
import { projects } from "@/data/projects";
import { introSlides, outroSlide } from "@/data/slides";

const MEDAL_COLORS = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  "grand prix": "#88C8E8",
  pencil: "#8B7355",
  cristal: "#88C8E8",
};

const SKIP_KEYWORDS = ["finalist", "short list", "community", "multiple", "ranking"];

function parseAwardMedals(awardStr) {
  const circles = [];
  const segments = awardStr.split(",").map((s) => s.trim());

  for (const segment of segments) {
    const lower = segment.toLowerCase();

    if (SKIP_KEYWORDS.some((kw) => lower.includes(kw))) continue;

    let count = 1;
    const countMatch = segment.match(/^(\d+)x?\s/i);
    if (countMatch) count = parseInt(countMatch[1]);

    let color = null;
    if (lower.includes("grand prix")) color = MEDAL_COLORS["grand prix"];
    else if (lower.includes("gold")) color = MEDAL_COLORS.gold;
    else if (lower.includes("silver")) color = MEDAL_COLORS.silver;
    else if (lower.includes("bronze")) color = MEDAL_COLORS.bronze;
    else if (lower.includes("pencil")) color = MEDAL_COLORS.pencil;
    else if (lower.includes("cristal")) color = MEDAL_COLORS.cristal;

    if (color) {
      for (let i = 0; i < count; i++) circles.push(color);
    }
  }

  return circles;
}

export default function Home() {
  // Combine intro slides, projects, and outro
  const allSlides = [...introSlides, ...projects, outroSlide];

  return (
    <SmoothScroll>
      {allSlides.map((slide, index) => {
        // Check if this is a project slide
        const isProject = slide.title && !slide.type;

        // Sticky sections (greeting, intro, projects) need a high z-index so
        // their pinned content stays on top of the non-sticky section that follows.
        // Non-sticky sections (awards-belt, contact) sit below the preceding sticky.
        const isStickySection = slide.type === "greeting" || slide.type === "intro" || isProject;
        const sectionZIndex = isStickySection ? 10 + index : 1;
        
        // For greeting slides, render with GreetingSection component
        if (slide.type === "greeting") {
          return (
            <section
              key={slide.id}
              className="relative"
              style={{ backgroundColor: slide.color, zIndex: sectionZIndex }}
            >
              <GreetingSection 
                title={slide.title} 
                subtitle={slide.subtitle}
                color={slide.color}
              />
            </section>
          );
        }
        
        // For project slides, render with HorizontalProject component
        if (isProject) {
          return (
            <section
              key={slide.id}
              className="relative"
              style={{ backgroundColor: slide.color, zIndex: sectionZIndex }}
            >
              <HorizontalProject project={slide} />
            </section>
          );
        }
        
        // For intro slides, render with IntroSection component
        if (slide.type === "intro") {
          return (
            <section
              key={slide.id}
              className="relative"
              style={{ backgroundColor: slide.color, zIndex: sectionZIndex }}
            >
              <IntroSection slide={slide} />
            </section>
          );
        }
        
        
        // For all other slides, use the regular layout
        return (
          <section
            key={slide.id}
            className="relative flex items-center justify-center min-h-screen"
            style={{ backgroundColor: slide.color, zIndex: sectionZIndex }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={
                slide.type === "awards-belt"
                  ? "w-full h-full flex items-center justify-center"
                  : "text-center max-w-4xl px-8"
              }
            >

            {slide.type === "awards-belt" && (
              <div className="w-full max-w-6xl px-8 grid grid-cols-1 md:grid-cols-2 gap-16 text-left items-start">
                {/* Left Column: Awards */}
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-bold border-b border-white/20 pb-4 mb-2">
                    Awards
                  </h2>
                  <div className="flex flex-col gap-1 w-full">
                    {slide.awards.map((award, idx) => {
                      const medals = parseAwardMedals(award.award);
                      return (
                        <motion.div
                          key={`award-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="group opacity-80 hover:opacity-100 transition-all cursor-default"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{award.name}</span>
                            <span className="opacity-40 text-sm">·</span>
                            <span className="opacity-40 text-xs whitespace-nowrap">{award.location}</span>
                          </div>

                          {/* Circles + award text - revealed on hover */}
                          <div className="flex items-center gap-2 h-0 group-hover:h-6 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-out">
                            {medals.length > 0 && (
                              <div className="flex gap-1 shrink-0">
                                {medals.map((color, i) => (
                                  <span
                                    key={i}
                                    className="w-2 h-2 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            )}
                            <span className="font-bold text-xs opacity-70">{award.award}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Exhibitions */}
                {slide.exhibitions && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold border-b border-white/20 pb-4 mb-2">
                      Exhibitions
                    </h2>
                    <div className="flex flex-col gap-2.5 w-full">
                      {slide.exhibitions.map((exhibition, idx) => (
                        <motion.div
                          key={`exhibition-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <span className="font-mono text-sm">{exhibition.name}</span>
                          <span className="opacity-40 text-sm">&nbsp;·&nbsp;</span>
                          <span className="font-bold text-sm">{exhibition.year}</span>
                          <span className="opacity-40 text-sm">&nbsp;·&nbsp;</span>
                          <span className="opacity-40 text-xs whitespace-nowrap">{exhibition.location}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {slide.type === "contact" && (
              <>
                <h1 className="text-6xl font-bold mb-4 text-left">{slide.title}</h1>
                <div className="flex flex-col gap-6 text-xl text-left">
                  <a 
                    href={`mailto:${slide.email}`}
                    className=""
                  >
                   {slide.email}
                  </a>
                </div>
              </>
            )}

            </motion.div>
          </section>
        );
      })}
    </SmoothScroll>
  );
}
