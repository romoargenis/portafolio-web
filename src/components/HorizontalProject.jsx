"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HorizontalProject({ project }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate total distance to scroll through all images
  const imageCount = project.images?.length || 0;
  const IMAGE_WIDTH_LARGE = 400;
  const IMAGE_WIDTH_SMALL = 300;
  const GAP = 16;
  
  // Sum actual image widths (alternating large/small)
  let imagesWidth = 0;
  for (let i = 0; i < imageCount; i++) {
    imagesWidth += (i % 2 === 0 ? IMAGE_WIDTH_LARGE : IMAGE_WIDTH_SMALL) + GAP;
  }
  
  // Only scroll the overflow: images beyond the visible ~50vw
  const totalDistance = Math.max(imagesWidth - 800, 0);
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <div ref={containerRef} className="h-[250vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <motion.div 
          className="flex items-center gap-4 will-change-transform"
          style={{ x }}
        >
          {/* Panel 1: Text Content */}
          <div className="flex-shrink-0 flex items-center justify-center px-8" style={{ width: '50vw' }}>
            <div className="text-left max-w-2xl">
              <h2 className="text-5xl font-bold mb-4">{project.title}</h2>
              <p className="text-2xl mb-4 opacity-80">{project.role}</p>
              {project.description && (
                <p className="text-base opacity-70 mt-6 leading-relaxed">
                  {project.description}
                </p>
              )}
              <div className="mt-8 flex gap-2 flex-wrap">
                {project.tags?.map((tag, index) => (
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
          
          {/* Panel 2: Images */}
          {project.images?.map((image, idx) => (
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
                alt={`${project.title} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
