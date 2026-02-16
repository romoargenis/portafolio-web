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
            className="relative flex items-center justify-center"
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
              <div className="w-full max-w-6xl px-8 grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
                {/* Left Column: Awards */}
                <div className="flex flex-col gap-8 items-center">
                  <h2 className="text-2xl font-bold border-b border-white/20 pb-4 mb-2 inline-block px-8">
                    Awards
                  </h2>
                  <div className="flex flex-col gap-2 w-full">
                    {slide.awards.map((award, idx) => (
                      <motion.div
                        key={`award-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="opacity-80 hover:opacity-100 transition-opacity font-mono"
                      >
                        {award}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Exhibitions */}
                {slide.exhibitions && (
                  <div className="flex flex-col gap-8 items-center m-8">
                    <h2 className="text-2xl font-bold border-b border-white/20 pb-4 mb-2 inline-block px-8">
                      Exhibitions
                    </h2>
                    <div className="flex flex-col gap-2 w-full">
                      {slide.exhibitions.map((exhibition, idx) => (
                        <motion.div
                          key={`exhibition-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="opacity-80 hover:opacity-100 transition-opacity font-mono"
                        >
                          {exhibition}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {slide.type === "contact" && (
              <>
                <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-2xl opacity-80 mb-12">{slide.subtitle}</p>
                <div className="flex flex-col gap-6 text-xl">
                  <a 
                    href={`mailto:${slide.email}`}
                    className="px-6 py-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    📧 {slide.email}
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
