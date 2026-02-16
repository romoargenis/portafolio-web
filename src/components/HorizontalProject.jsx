"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import PhoneFrame from "./PhoneFrame";
import ResponsiveScrollPair from "./ResponsiveScrollPair";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

function parseHighlight(content) {
  let title = "";
  let body = "";

  if (typeof content === "object") {
    title = content.title;
    body = content.body;
  } else {
    title = content;
    const match = content.match(/^([^.:]+[.:])(.*)$/);
    if (match) {
      title = match[1];
      body = match[2].trim();
    }
  }

  return { title, body };
}

export default function HorizontalProject({ project }) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const highlights = project.highlights || [];

  const bentoItems = useMemo(() => {
    const items = [];
    let highlightIdx = 0;

    project.images?.forEach((image, idx) => {
      items.push({
        type: "image",
        src: image,
        idx,
        width: 400,
        height: 400,
      });

      if ((idx + 1) % 2 === 0 && highlightIdx < highlights.length) {
        items.push({
          type: "text",
          content: highlights[highlightIdx],
          idx: highlightIdx,
        });
        highlightIdx++;
      }
    });

    while (highlightIdx < highlights.length) {
      items.push({
        type: "text",
        content: highlights[highlightIdx],
        idx: highlightIdx,
      });
      highlightIdx++;
    }

    return items;
  }, [project.images, highlights]);

  const phoneFrameWidth = 280 + 20;
  const hasPhoneFrame = !!project.phoneFrameImage;

  const RESPONSIVE_PAIR_WIDTH = 520 + 16;
  const hasResponsivePair = project.responsiveImages?.length >= 2;

  const VIDEO_PAIR_WIDTH = 320 + 16 + 160 + 16;
  const hasVideos = project.videos?.desktop && project.videos?.mobile;

  const TEXT_CARD_WIDTH = 400;
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

  const totalDistance = Math.max(totalContentWidth - 800, 0);

  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────
  if (isMobile) {
    const imageItems = bentoItems.filter((item) => item.type === "image");
    const textItems = bentoItems.filter((item) => item.type === "text");

    return (
      <div className="py-16 px-5">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
          <p className="text-lg mb-3 opacity-80">{project.role}</p>
          {project.description && (
            <p className="text-sm opacity-70 leading-relaxed mb-5">
              {project.description}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            {project.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white/10 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Horizontal swipeable image gallery */}
        <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 mb-6">
          <div className="flex gap-3" style={{ width: "max-content" }}>
            {imageItems.map((item) => {
              const isVideo = item.src?.endsWith(".mp4");
              return (
                <div
                  key={`img-${item.idx}`}
                  className="flex-shrink-0 rounded-xl overflow-hidden bg-white/5"
                  style={{ width: 260, height: 260 }}
                >
                  {isVideo ? (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={`${project.title} ${item.idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
            {hasPhoneFrame && (
              <div className="flex-shrink-0 flex items-center">
                <PhoneFrame
                  src={project.phoneFrameImage}
                  alt={`${project.title} — mobile view`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Text highlight cards */}
        <div className="flex flex-col gap-4 mb-6">
          {textItems.map((item) => {
            const { title, body } = parseHighlight(item.content);
            return (
              <motion.div
                key={`text-${item.idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6"
              >
                <h5 className="mb-2 text-lg font-semibold leading-snug">
                  {title}
                </h5>
                {body && (
                  <p className="text-sm opacity-70 leading-relaxed">{body}</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Responsive scroll pair */}
        {hasResponsivePair && (
          <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 mb-6">
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {project.responsiveImages.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                  style={{ width: 260, height: 380 }}
                >
                  <img
                    src={src}
                    alt={i === 0 ? "Desktop" : "Mobile"}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video pair */}
        {hasVideos && (
          <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
            <div className="flex gap-3 items-end" style={{ width: "max-content" }}>
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden bg-black/40"
                style={{ width: 260, height: 146 }}
              >
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
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden bg-black/40"
                style={{ width: 130, height: 231 }}
              >
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
          </div>
        )}
      </div>
    );
  }

  // ── DESKTOP LAYOUT (horizontal scroll-jacking) ──────────────────────
  return (
    <div ref={containerRef} className="h-[250vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <motion.div
          className="flex items-center gap-4 will-change-transform"
          style={{ x }}
        >
          {/* Panel 1: Text Content */}
          <div
            className="flex-shrink-0 flex items-center justify-center px-8"
            style={{ width: "50vw" }}
          >
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
              const { title, body } = parseHighlight(item.content);

              return (
                <div
                  key={`text-${item.idx}`}
                  className="flex-shrink-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 shadow-sm hover:bg-white/10 transition-colors flex flex-col justify-start text-left"
                  style={{
                    width: `${TEXT_CARD_WIDTH}px`,
                    height: "400px",
                  }}
                >
                  <h5 className="mb-3 text-2xl font-semibold tracking-tight leading-8">
                    {title}
                  </h5>
                  {body && (
                    <p className="text-base opacity-70 leading-relaxed">
                      {body}
                    </p>
                  )}
                </div>
              );
            }

            const isVideo = item.src?.endsWith(".mp4");

            return (
              <div
                key={`img-${item.idx}`}
                className="flex-shrink-0 rounded-lg overflow-hidden bg-white/5"
                style={{
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
              >
                {isVideo ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={`${project.title} ${item.idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
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
            <div
              key="responsive-pair"
              className="flex-shrink-0 flex items-center"
            >
              <ResponsiveScrollPair
                images={project.responsiveImages}
                altLeft="Desktop"
                altRight="Mobile"
              />
            </div>
          )}
          {hasVideos && (
            <div
              key="video-pair"
              className="flex-shrink-0 flex items-center gap-4"
            >
              <div
                className="rounded-lg overflow-hidden bg-black/40"
                style={{ width: 320, height: 180 }}
              >
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
              <div
                className="rounded-lg overflow-hidden bg-black/40"
                style={{ width: 160, height: 284 }}
              >
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
