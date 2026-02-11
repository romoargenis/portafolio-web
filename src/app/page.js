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
        
        // For greeting slides, render with GreetingSection component
        if (slide.type === "greeting") {
          return (
            <section
              key={slide.id}
              className=""
              style={{ backgroundColor: slide.color }}
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
              className=""
              style={{ backgroundColor: slide.color }}
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
              className=""
              style={{ backgroundColor: slide.color }}
            >
              <IntroSection slide={slide} />
            </section>
          );
        }
        
        
        // For all other slides, use the regular layout
        return (
          <section
            key={slide.id}
            className="h-screen flex items-center justify-center"
            style={{ backgroundColor: slide.color }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={
                slide.type === "awards-belt"
                  ? "w-full h-full overflow-y-auto"
                  : "text-center max-w-4xl px-8"
              }
            >

            {slide.type === "awards-belt" && (
              <div className="min-h-full flex flex-col">
                {/* Layout 1: Scrolling Belts */}
                <div className="w-full py-20 flex flex-col justify-center overflow-hidden border-b border-white/10">
                  {/* Awards Scrolling Belt */}
                  <div className="relative mb-12 w-full">
                    <div className="flex animate-scroll-left">
                      {slide.awards.map((award, idx) => (
                        <div key={`award-1-${idx}`} className="flex-shrink-0 mx-4 px-8 py-6">
                          <p className="text-xl font-semibold whitespace-nowrap uppercase">🏆 {award}</p>
                        </div>
                      ))}
                      {slide.awards.map((award, idx) => (
                        <div key={`award-2-${idx}`} className="flex-shrink-0 mx-4 px-8 py-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                          <p className="text-xl font-semibold whitespace-nowrap uppercase">🏆 {award}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exhibitions Scrolling Belt */}
                  {slide.exhibitions && (
                    <div className="relative w-full">
                      <div className="flex animate-scroll-right">
                        {slide.exhibitions.map((exhibition, idx) => (
                          <div key={`exhibition-1-${idx}`} className="flex-shrink-0 mx-4 px-8 py-6">
                            <p className="text-xl font-semibold whitespace-nowrap uppercase">🎨 {exhibition}</p>
                          </div>
                        ))}
                        {slide.exhibitions.map((exhibition, idx) => (
                          <div key={`exhibition-2-${idx}`} className="flex-shrink-0 mx-4 px-8 py-6">
                            <p className="text-xl font-semibold whitespace-nowrap uppercase">🎨 {exhibition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Layout 2: Centered Columns */}
                <div className="w-full max-w-7xl mx-auto px-8 py-20 flex flex-col justify-center flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
                    {/* Left Column: Awards */}
                    <div className="flex flex-col gap-8 items-center">
                      <h2 className="text-4xl font-bold border-b border-white/20 pb-4 mb-2 inline-block px-8">
                        Awards
                      </h2>
                      <div className="flex flex-col gap-4 w-full">
                        {slide.awards.map((award, idx) => (
                          <motion.div
                            key={`award-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-xl opacity-80 hover:opacity-100 transition-opacity"
                          >
                            🏆 {award}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Exhibitions */}
                    {slide.exhibitions && (
                      <div className="flex flex-col gap-8 items-center">
                        <h2 className="text-4xl font-bold border-b border-white/20 pb-4 mb-2 inline-block px-8">
                          Exhibitions
                        </h2>
                        <div className="flex flex-col gap-4 w-full">
                          {slide.exhibitions.map((exhibition, idx) => (
                            <motion.div
                              key={`exhibition-${idx}`}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-xl opacity-80 hover:opacity-100 transition-opacity"
                            >
                              🎨 {exhibition}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
