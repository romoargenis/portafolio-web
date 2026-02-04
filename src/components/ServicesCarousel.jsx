"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ServicesCarousel({ title, services }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="text-center max-w-4xl px-8">
          <motion.h1 
            className="text-5xl font-bold mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          <div className="relative h-64 flex items-center justify-center overflow-hidden">
            {services.map((service, index) => {
              // Calculate progress ranges for each service
              const totalServices = services.length;
              const segmentSize = 1 / totalServices;
              const start = index * segmentSize;
              const mid = start + segmentSize * 0.5;
              const end = (index + 1) * segmentSize;
              
              // Snappier opacity transitions - quick fade in/out
              const opacity = useTransform(
                scrollYProgress,
                [start, start + segmentSize * 0.15, end - segmentSize * 0.15, end],
                [0, 1, 1, 0]
              );
              
              // Y position: push effect - starts below, centers, then continues up and out
              const y = useTransform(
                scrollYProgress,
                [start, start + segmentSize * 0.2, end - segmentSize * 0.2, end],
                [100, 0, 0, -100]
              );

              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity,
                    y,
                  }}
                >
                  <div className="p-12 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 w-full max-w-2xl">
                    <p className="text-4xl font-semibold">{service}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
