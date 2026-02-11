"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import PhoneFrame from "./PhoneFrame";
import ResponsiveScrollPair from "./ResponsiveScrollPair";

export default function HorizontalProject({ project }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const highlights = project.highlights || [];

  // Build the bento sequence: image, text, image, text, image...
  // Text cards are inserted after every 2 images
  const bentoItems = useMemo(() => {
    const items = [];
    let highlightIdx = 0;

    project.images?.forEach((image, idx) => {
      // Add the image
      items.push({
        type: "image",
        src: image,
        idx,
        width: idx % 2 === 0 ? 400 : 300,
        height: idx % 2 === 0 ? 500 : 400,
      });

      // After every 2nd image, insert a text highlight
      if ((idx + 1) % 2 === 0 && highlightIdx < highlights.length) {
        items.push({
          type: "text",
          content: highlights[highlightIdx],
          idx: highlightIdx,
        });
        highlightIdx++;
      }
    });

    return items;
  }, [project.images, highlights]);

  // Phone frame panel (9:16 scrollable) when project has phoneFrameImage
  const phoneFrameWidth = 280 + 20; // width + gap
  const hasPhoneFrame = !!project.phoneFrameImage;

  // Responsive pair: two images scrolling in sync (desktop + mobile)
  const RESPONSIVE_PAIR_WIDTH = 520 + 16; // width + gap
  const hasResponsivePair = project.responsiveImages?.length >= 2;

  // Video pair: desktop + mobile (e.g. Bermudez)
  const VIDEO_PAIR_WIDTH = 320 + 16 + 160 + 16; // desktop + gap + mobile + gap
  const hasVideos = project.videos?.desktop && project.videos?.mobile;

  // Calculate total width of bento items (+ phone frame, responsive pair, videos if present)
  const TEXT_CARD_WIDTH = 220;
  const GAP = 16;

  let totalContentWidth = 0;
  bentoItems.forEach((item) => {
    if (item.type === "image") {
      totalContentWidth += item.width + GAP;
    } else {
      totalContentWidth += TEXT_CARD_WIDTH + GAP;
    }
  });
  if (hasPhoneFrame) totalContentWidth += phoneFrameWidth;
  if (hasResponsivePair) totalContentWidth += RESPONSIVE_PAIR_WIDTH;
  if (hasVideos) totalContentWidth += VIDEO_PAIR_WIDTH;

  // Only scroll the overflow beyond the visible area
  const totalDistance = Math.max(totalContentWidth - 800, 0);
  
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
          
          {/* Panel 2: Bento grid — images + text highlights */}
          {bentoItems.map((item, i) => {
            if (item.type === "text") {
              return (
                <div
                  key={`text-${item.idx}`}
                  className="flex-shrink-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-6"
                  style={{
                    width: `${TEXT_CARD_WIDTH}px`,
                    height: item.idx % 2 === 0 ? '300px' : '250px',
                  }}
                >
                  <p className="text-xl font-semibold text-center leading-snug opacity-80">
                    {item.content}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={`img-${item.idx}`}
                className="flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              >
                <img 
                  src={item.src} 
                  alt={`${project.title} ${item.idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
          {hasPhoneFrame && (
            <div key="phone-frame" className="flex-shrink-0 flex items-center">
              <PhoneFrame
                src={project.phoneFrameImage}
                alt={`${project.title} — mobile view`}
              />
            </div>
          )}
          {hasResponsivePair && (
            <div key="responsive-pair" className="flex-shrink-0 flex items-center">
              <ResponsiveScrollPair
                images={project.responsiveImages}
                altLeft="Desktop"
                altRight="Mobile"
              />
            </div>
          )}
          {hasVideos && (
            <div key="video-pair" className="flex-shrink-0 flex items-center gap-4">
              <div className="rounded-lg overflow-hidden bg-black/40" style={{ width: 320, height: 180 }}>
                <video
                  src={project.videos.desktop}
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                  aria-label={`${project.title} — desktop`}
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-black/40" style={{ width: 160, height: 284 }}>
                <video
                  src={project.videos.mobile}
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                  aria-label={`${project.title} — mobile`}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
