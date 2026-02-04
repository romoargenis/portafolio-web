"use client";

import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import HiCircle from "@/components/HiCircle";
import HorizontalProject from "@/components/HorizontalProject";
import SplitText from "@/components/SplitText";
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
              transition={{ duration: 0.6 }}
              className={
                slide.type === "awards-belt" || slide.type === "intro"
                  ? "w-full h-full overflow-hidden"
                  : "text-center max-w-4xl px-8"
              }
            >
            {/* Intro slides rendering */}
            {slide.type === "greeting" && (
              <>
                <HiCircle />
                <h1 className="text-6xl font-bold mb-4 relative z-10">{slide.title}</h1>
                <p className="text-2xl opacity-80 relative z-10">{slide.subtitle}</p>
              </>
            )}
            
            {slide.type === "intro" && (
              <div className="w-full h-full flex items-center justify-center gap-8 px-12">
                {/* Left 50% - Title and Subtitle */}
                <div className="w-1/2 flex flex-col justify-center text-left">
                  <h1 className="text-6xl font-bold mb-6">{slide.title}</h1>
                  <p className="text-3xl opacity-90">{slide.subtitle}</p>
                </div>
                
                {/* Right 50% - Image background with description and awards belt */}
                <div className="w-1/2 h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                  {/* Placeholder background image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop')"
                    }}
                  />
                  
                  {/* Content overlay */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    {/* Description at top */}
                    {slide.description && (
                      <div className="text-6xl font-light mb-6 flex items-center justify-center h-full">
                        <SplitText 
                          text={slide.description} 
                          className="text-lg leading-relaxed text-center"
                        />
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            )}

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
            
            {slide.type === "services" && (
              <>
                <h1 className="text-5xl font-bold mb-8">{slide.title}</h1>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {slide.services.map((service, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white/10 rounded-lg backdrop-blur-sm"
                    >
                      <p className="text-xl">{service}</p>
                    </div>
                  ))}
                </div>
              </>
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
                  <a 
                    href={`tel:${slide.phone}`}
                    className="px-6 py-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    📱 {slide.phone}
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
