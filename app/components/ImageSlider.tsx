"use client";

import Image from "next/image";
import Link from "next/link";
import ImageLightbox from "./ImageLightbox";
import { useRef, useState } from "react";

interface ImageSliderProps {
  images: string[];
  alt: string;
  sizes: string;
  href?: string;
  priority?: boolean;
  zoomable?: boolean;
  className?: string;
}

export default function ImageSlider({
  images,
  alt,
  sizes,
  href,
  priority = false,
  zoomable = false,
  className = "",
}: ImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className={`relative bg-[#faf8f5] ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest font-medium">
          [ No Image ]
        </div>
      </div>
    );
  }

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div
      className={`group/slider relative bg-[#faf8f5] overflow-hidden ${className}`}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => {
          const img = (
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              draggable={false}
              className="object-contain p-2 object-center"
            />
          );
          return (
            <div
              key={src + i}
              className="relative h-full w-full shrink-0 snap-center"
            >
              {href ? (
                <Link
                  href={href}
                  aria-label={alt}
                  className="relative block h-full w-full"
                >
                  {img}
                </Link>
              ) : zoomable ? (
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label="Zoom image"
                  className="relative block h-full w-full cursor-zoom-in"
                >
                  {img}
                </button>
              ) : (
                img
              )}
            </div>
          );
        })}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className="group/dot flex h-5 w-4 items-center justify-center cursor-pointer"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === active
                    ? "h-2 w-2 bg-stone-900 ring-2 ring-white/90 shadow"
                    : "h-1.5 w-1.5 bg-stone-400/70 ring-1 ring-white/70 group-hover/dot:bg-stone-600"
                }`}
              />
            </button>
          ))}
        </div>
      )}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous image"
            className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 cursor-pointer md:opacity-0 md:group-hover/slider:opacity-100 ${
              active === 0 ? "pointer-events-none opacity-0!" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 md:h-5 md:w-5"
              aria-hidden
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next image"
            className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 cursor-pointer md:opacity-0 md:group-hover/slider:opacity-100 ${
              active === images.length - 1
                ? "pointer-events-none opacity-0!"
                : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 md:h-5 md:w-5"
              aria-hidden
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      {zoomable && (
        <button
          type="button"
          onClick={() => setLightbox(active)}
          aria-label="Open zoom"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-stone-800 shadow-sm backdrop-blur-sm transition-all hover:bg-stone-900 hover:text-white cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4.5 w-4.5"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </button>
      )}

      {lightbox !== null && (
        <ImageLightbox
          images={images}
          alt={alt}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
