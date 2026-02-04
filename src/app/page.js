"use client";

import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import HiCircle from "@/components/HiCircle";
import HorizontalProject from "@/components/HorizontalProject";
import SplitText from "@/components/SplitText";
import ServicesCarousel from "@/components/ServicesCarousel";
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
              className="border-t border-white/10"
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
              className="border-t border-white/10"
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
              className="border-t border-white/10"
              style={{ backgroundColor: slide.color }}
            >
              <IntroSection slide={slide} />
            </section>
          );
        }
        
        // For services slides, render with ServicesCarousel component
        if (slide.type === "services") {
          return (
            <section
              key={slide.id}
              className="border-t border-white/10"
              style={{ backgroundColor: slide.color }}
            >
              <ServicesCarousel title={slide.title} services={slide.services} />
            </section>
          );
        }
        
        // For all other slides, use the regular layout
        return (
          <section
            key={slide.id}
            className="h-screen flex items-center justify-center border-t border-white/10"
            style={{ backgroundColor: slide.color }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={
                slide.type === "awards-belt"
                  ? "w-full h-full overflow-hidden"
                  : "text-center max-w-4xl px-8"
              }
            >

            {slide.type === "awards-belt" && (
              <div className="w-full h-full flex flex-col justify-center overflow-hidden">
                {/* <h2 className="text-3xl font-bold mb-12 text-center">Awards & Recognition</h2> */}
                
                {/* Awards Scrolling Belt */}
                <div className="relative mb-12 w-full">
                  <div className="flex animate-scroll-left">
                    {/* First set of awards */}
                    {slide.awards.map((award, idx) => (
                      <div
                        key={`award-1-${idx}`}
                        className="flex-shrink-0 mx-4 px-8 py-6"
                      >
                        <p className="text-xl font-semibold whitespace-nowrap uppercase">🏆 {award}</p>
                      </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {slide.awards.map((award, idx) => (
                      <div
                        key={`award-2-${idx}`}
                        className="flex-shrink-0 mx-4 px-8 py-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                      >
                        <p className="text-xl font-semibold whitespace-nowrap uppercase">🏆 {award}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exhibitions Scrolling Belt (opposite direction) */}
                {slide.exhibitions && (
                  <div className="relative w-full">
                    <div className="flex animate-scroll-right">
                      {/* First set of exhibitions */}
                      {slide.exhibitions.map((exhibition, idx) => (
                        <div
                          key={`exhibition-1-${idx}`}
                          className="flex-shrink-0 mx-4 px-8 py-6"
                        >
                          <p className="text-xl font-semibold whitespace-nowrap uppercase">🎨 {exhibition}</p>
                        </div>
                      ))}
                      {/* Duplicate set for seamless loop */}
                      {slide.exhibitions.map((exhibition, idx) => (
                        <div
                          key={`exhibition-2-${idx}`}
                          className="flex-shrink-0 mx-4 px-8 py-6"
                        >
                          <p className="text-xl font-semibold whitespace-nowrap uppercase">🎨 {exhibition}</p>
                        </div>
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
