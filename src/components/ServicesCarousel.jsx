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
      <div className="sticky top-0 h-screen w-full flex items-end justify-center pb-20">
        <div className="text-center w-full px-8 flex items-center justify-center gap-4">
          <motion.h1 
            className="text-4xl font-bold text-[#333] whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          <div className="relative h-12 w-64 overflow-hidden">
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
                [40, 0, 0, -40]
              );

              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex items-center justify-start"
                  style={{
                    opacity,
                    y,
                  }}
                >
                  <p className=" text-[#333] whitespace-nowrap">{service}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
