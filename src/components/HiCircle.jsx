"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export default function HiCircle() {
  const numberOfHis = 6;
  const circleRotation = useMotionValue(0);

  // Responsive radius based on viewport size
  const [radius, setRadius] = useState(800);
  const [isMounted, setIsMounted] = useState(false);
  const fontSize = radius * .5;

  useEffect(() => {
    setIsMounted(true);
    const updateRadius = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      setRadius(vmin * 0.85);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const startTime = Date.now();
    const duration = 90000;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      circleRotation.set(progress * 360);
      requestAnimationFrame(update);
    };

    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [circleRotation, isMounted]);

  // Don't render the animated elements until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative" style={{ width: 1600, height: 1600 }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          rotate: circleRotation,
        }}
      >
        {Array.from({ length: numberOfHis }).map((_, index) => {
          const angle = (index * 360) / numberOfHis;
          const angleRad = (angle * Math.PI) / 180;

          // Position on the circle circumference
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <motion.div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                left: "50%",
                top: "50%",
                x,
                y,
                width: 0,
                height: 0,
              }}
            >
              <motion.div
                className="font-bold whitespace-nowrap"
                style={{
                  rotate: `${angle + 90}deg`,
                  fontSize: fontSize,
                  transformOrigin: "center center",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
              >
                Hi!
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
