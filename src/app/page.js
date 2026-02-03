"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import HiCircle from "@/components/HiCircle";
import { projects } from "@/data/projects";
import { introSlides, outroSlide } from "@/data/slides";

export default function Home() {
  // Combine intro slides, projects, and outro
  const allSlides = [...introSlides, ...projects, outroSlide];

  useEffect(() => {
    const handleWheel = (e) => {
      // Find all project sections
      const projectSections = document.querySelectorAll('.project-section');
      
      projectSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
        
        if (isInView) {
          const container = section.querySelector('.horizontal-scroll-container');
          if (!container) return;

          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          // If scrolling down and haven't reached the end
          if (e.deltaY > 0 && currentScroll < maxScrollLeft) {
            e.preventDefault();
            container.scrollLeft += e.deltaY * 2;
          }
          // If scrolling up and not at the start
          else if (e.deltaY < 0 && currentScroll > 0) {
            e.preventDefault();
            container.scrollLeft += e.deltaY * 2;
          }
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <SmoothScroll>
      {allSlides.map((slide, index) => (
        <section
          key={slide.id}
          className={`h-screen flex items-center justify-center border-t border-white/10 ${slide.title && !slide.type ? 'project-section' : ''}`}
          style={{ backgroundColor: slide.color }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={
              slide.title && !slide.type 
                ? "w-full h-full overflow-hidden" 
                : slide.type === "awards-belt"
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
              <>
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-2xl mb-2">{slide.subtitle}</p>
                {slide.description && (
                  <p className="text-lg opacity-80 mt-4 max-w-3xl mx-auto">{slide.description}</p>
                )}
              </>
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

            {/* Project slides rendering */}
            {slide.title && !slide.type && (
              <div className="horizontal-scroll-container w-full h-full flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Panel 1: Text Content */}
                <div className="w-screen h-full flex-shrink-0 snap-center flex items-center justify-center px-8">
                  <div className="text-left max-w-2xl">
                    <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-2xl mb-4 opacity-80">{slide.role}</p>
                    {slide.description && (
                      <p className="text-base opacity-70 mt-6 leading-relaxed">
                        {slide.description}
                      </p>
                    )}
                    <div className="mt-8 flex gap-2 flex-wrap">
                      {slide.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/10 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Panel 2: Horizontal Scrolling Images */}
                <div className="w-screen h-full flex-shrink-0 snap-center flex items-center overflow-x-auto px-8">
                  <div className="flex gap-4">
                    {slide.images?.map((image, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                        style={{
                          width: idx % 2 === 0 ? '400px' : '300px',
                          height: idx % 2 === 0 ? '500px' : '400px'
                        }}
                      >
                        <img 
                          src={image} 
                          alt={`${slide.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      ))}
    </SmoothScroll>
  );
}
