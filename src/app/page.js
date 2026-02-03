"use client";

import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import { projects } from "@/data/projects";
import { introSlides, outroSlide } from "@/data/slides";

export default function Home() {
  // Combine intro slides, projects, and outro
  const allSlides = [...introSlides, ...projects, outroSlide];

  return (
    <SmoothScroll>
      {allSlides.map((slide, index) => (
        <section
          key={slide.id}
          className="h-screen flex items-center justify-center border-t border-white/10"
          style={{ backgroundColor: slide.color }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={slide.title && !slide.type ? "w-full h-full flex" : "text-center max-w-4xl px-8"}
          >
            {/* Intro slides rendering */}
            {slide.type === "greeting" && (
              <>
                <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-2xl opacity-80">{slide.subtitle}</p>
              </>
            )}
            
            {slide.type === "intro" && (
              <>
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-2xl mb-2">{slide.subtitle}</p>
                {slide.description && (
                  <p className="text-lg opacity-80 mt-4">{slide.description}</p>
                )}
                {slide.Awards && slide.Awards.length > 0 && (
                  <div className="mt-8 text-left max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">Awards</h3>
                    <div className="text-sm opacity-70 space-y-1">
                      {slide.Awards.map((award, idx) => (
                        <p key={idx}>• {award}</p>
                      ))}
                    </div>
                  </div>
                )}
                {slide.Exibitions && slide.Exibitions.length > 0 && (
                  <div className="mt-6 text-left max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4">Exhibitions</h3>
                    <div className="text-sm opacity-70 space-y-1">
                      {slide.Exibitions.map((exhibition, idx) => (
                        <p key={idx}>• {exhibition}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
              <>
                {/* Left 50% - Text */}
                <div className="w-1/2 h-full flex items-center px-16">
                  <div className="text-left">
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
                
                {/* Right 50% - Bento Grid with Horizontal Scroll */}
                <div className="w-1/2 h-full flex items-center overflow-hidden">
                  <div className="flex gap-4 overflow-x-auto px-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              </>
            )}
          </motion.div>
        </section>
      ))}
    </SmoothScroll>
  );
}
