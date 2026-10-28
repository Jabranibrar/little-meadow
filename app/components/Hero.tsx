import React from "react";

const Sparkle = ({
  className,
  delay,
}: {
  className: string;
  delay: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={`hero-twinkle absolute ${className}`}
    style={{ "--d": delay } as React.CSSProperties}
    fill="currentColor"
  >
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </svg>
);

const delay = (s: string) => ({ "--d": s } as React.CSSProperties);

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-120 items-center overflow-hidden px-[8%] py-10 sm:min-h-144 md:min-h-172 md:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="hero-float absolute -left-40 top-10 h-112 w-md rounded-full bg-[#b9d4df]/60 blur-2xl" />
        <div className="hero-float-slow absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-[#f0c4b9]/60 blur-xl" />
        <div className="hero-float absolute left-[58%] -top-12 hidden h-52 w-52 rounded-full bg-pink-200/50 blur-2xl md:block" />

        <div className="absolute left-[6%] bottom-[14%] hidden h-24 w-24 rounded-full border-2 border-dashed border-[#e99a88]/40 sm:block" />
        <div className="absolute right-[8%] top-[16%] hidden h-14 w-14 rounded-full border-2 border-dashed border-[#9cc5d6]/60 sm:block" />

        <Sparkle
          className="left-[14%] top-[22%] h-5 w-5 text-[#e99a88]"
          delay="0s"
        />
        <Sparkle
          className="right-[16%] top-[30%] h-4 w-4 text-[#9cc5d6]"
          delay="1.2s"
        />
        <Sparkle
          className="left-[22%] bottom-[24%] h-3.5 w-3.5 text-pink-300"
          delay="2s"
        />
        <Sparkle
          className="right-[24%] bottom-[18%] h-6 w-6 text-[#e99a88]/80"
          delay="0.6s"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-190 text-center">
        <h1
          className="hero-rise mb-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-stone-900 sm:text-6xl md:mb-8 md:text-7xl"
          style={delay("0.1s")}
        >
          Little clothes
          <br />
          for big{" "}
          <span className="relative inline-block italic text-[#e99a88]">
            adventures
            <svg
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              aria-hidden
              className="absolute -bottom-1 left-0 h-2.5 w-full sm:h-3"
            >
              <path
                className="hero-underline"
                d="M2 8 C 20 2, 40 14, 60 8 S 100 2, 118 8"
                fill="none"
                stroke="#e99a88"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p
          className="hero-rise mx-auto mb-8 max-w-170 text-base leading-relaxed text-[#6d6761] sm:text-lg md:mb-10 md:text-xl"
          style={delay("0.3s")}
        >
          Sweet threads for little feet — premium quality outfits for boys,
          girls, and unisex styles.
        </p>

        <div
          className="hero-rise flex flex-wrap justify-center gap-3 sm:gap-4"
          style={delay("0.5s")}
        >
          <a
            href="#shop"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e99a88] bg-[#e99a88] px-9 py-4 font-extrabold text-white shadow-lg shadow-[#e99a88]/30 transition-all hover:-translate-y-0.5 hover:bg-[#e48a76] hover:shadow-xl sm:w-auto"
          >
            Shop New In
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="#story"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#302d2b] bg-white/40 px-9 py-4 font-extrabold backdrop-blur-xs transition-all hover:-translate-y-0.5 hover:bg-[#302d2b] hover:text-white sm:w-auto"
          >
            Our Story
          </a>
        </div>
      </div>

      <a
        href="#shop"
        aria-label="Scroll to collection"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <span className="hero-nudge flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white/70 text-stone-600 shadow-2xs backdrop-blur-xs transition-colors hover:bg-stone-900 hover:text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </a>
    </section>
  );
}
