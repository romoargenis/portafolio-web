"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export default function HiCircle() {
  const numberOfHis = 8; // Number of "Hi" texts around the circle
  const radius = 800; // Huge radius - bigger than the screen
  const circleRotation = useMotionValue(0);

  useEffect(() => {
    // Animate the rotation value
    const animate = () => {
      const startTime = Date.now();
      const duration = 60000; // 60 seconds

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        circleRotation.set(progress * 360);
        requestAnimationFrame(update);
      };

      update();
    };

    animate();
  }, [circleRotation]);

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
          const angleRad = (angle * Math.PI) / -180;
          
          // Calculate position on circle
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <motion.div
              key={index}
              className="absolute font-bold opacity-20"
              style={{
                left: "50%",
                top: "50%",
                x,
                y,
                rotate: angle, // Rotate text to align with circle baseline
                translateX: "-50%",
                translateY: "-50%",
                fontSize: "400px", // Huge text
                transformOrigin: "center center",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15, // Sequential fade-in with more spacing
                ease: "easeOut",
              }}
            >
              Hi
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
