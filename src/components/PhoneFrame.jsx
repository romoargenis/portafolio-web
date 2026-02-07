"use client";

/**
 * PhoneFrame: 9:16 aspect ratio viewport with vertical scroll to simulate a phone.
 * Use for long mobile screenshots (e.g. full-page capture).
 */
export default function PhoneFrame({ src, alt = "Mobile view" }) {
  return (
    <div
      className="flex-shrink-0 rounded-[2.5rem] overflow-hidden bg-black border-[10px] border-neutral-800 shadow-2xl"
      style={{
        aspectRatio: "9 / 16",
        width: "min(280px, 40vw)",
        maxHeight: "85vh",
      }}
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:thin]">
        <img
          src={src}
          alt={alt}
          className="w-full block min-h-full object-top object-cover"
          style={{ minHeight: "max-content" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
