"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Splash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem("lm_splash") === "1";
      sessionStorage.setItem("lm_splash", "1");
    } catch {}

    if (seen) {
      el.style.display = "none";
      return;
    }

    const t = setTimeout(() => {
      el.style.display = "none";
    }, 2900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="splash fixed inset-0 z-200 flex flex-col items-center justify-center bg-[#faf8f5]"
    >
      <div className="relative">
        <span className="splash-ring absolute inset-0 rounded-full border border-stone-400" />
        <span className="splash-ring splash-ring-2 absolute inset-0 rounded-full border border-pink-300" />
        <div className="splash-logo relative h-24 w-24 overflow-hidden rounded-full border border-stone-200 shadow-lg sm:h-28 sm:w-28">
          <Image
            src="/little-meadow.jpeg"
            alt=""
            fill
            priority
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      <p
        className="splash-rise mt-6 font-serif text-3xl italic text-stone-900 sm:text-4xl"
        style={{ "--d": "0.6s" } as React.CSSProperties}
      >
        Little Meadow
      </p>
      <span className="splash-line mt-4 block h-px bg-stone-400" />
      <p
        className="splash-rise mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 sm:text-xs"
        style={{ "--d": "1s" } as React.CSSProperties}
      >
        Made for little moments
      </p>
    </div>
  );
}
