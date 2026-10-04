import React from "react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-120.5 sm:min-h-145.5 md:min-h-172.5 flex items-center px-[8%] py-6 md:py-16 overflow-hidden"
    >
      <div className="absolute w-117.5 h-117.5 bg-[#b9d4df] rounded-full -left-42.5 top-15 z-0 opacity-60"></div>
      <div className="absolute w-51.25 h-51.25 bg-[#f0c4b9] rounded-full right-[2%] top-90 z-0 opacity-60"></div>

      <div className="relative z-10 max-w-190 mx-auto text-center">
        <div className="text-lg text-[#68625d] font-semibold mb-4">
          A small kidswear label (Ages 1–5 Years)
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 md:mb-8">
          Little clothes
          <br />
          for big <span className="text-[#e99a88]">adventures</span>
        </h1>
        <p className="text-lg md:text-xl text-[#6d6761] max-w-170 mx-auto mb-6 md:mb-10 leading-relaxed">
          Sweet threads for little feet — premium quality outfits for boys,
          girls, and unisex styles.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#shop"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#e99a88] text-white font-extrabold border-2 border-[#e99a88] hover:-translate-y-0.5 transition-all"
          >
            Shop New In
          </a>
          <a
            href="#story"
            className="w-full sm:w-auto px-9 py-4 rounded-full border-2 border-[#302d2b] font-extrabold hover:-translate-y-0.5 transition-all"
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
}
