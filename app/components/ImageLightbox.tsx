"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ImageLightboxProps {
  images: string[];
  alt: string;
  startIndex?: number;
  onClose: () => void;
}

const MIN = 1;
const MAX = 4;

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

export default function ImageLightbox({
  images,
  alt,
  startIndex = 0,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef(0);

  const clampPos = useCallback((x: number, y: number, s: number) => {
    const el = boxRef.current;
    if (!el) return { x, y };
    const mx = (el.clientWidth * (s - 1)) / 2;
    const my = (el.clientHeight * (s - 1)) / 2;
    return {
      x: Math.max(-mx, Math.min(mx, x)),
      y: Math.max(-my, Math.min(my, y)),
    };
  }, []);

  const zoomTo = useCallback(
    (next: number) => {
      const s = Math.min(MAX, Math.max(MIN, next));
      setScale(s);
      setPos((p) => (s === 1 ? { x: 0, y: 0 } : clampPos(p.x, p.y, s)));
    },
    [clampPos]
  );

  const go = useCallback(
    (i: number) => {
      setIndex((i + images.length) % images.length);
      setScale(1);
      setPos({ x: 0, y: 0 });
    },
    [images.length]
  );

  // page scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "+" || e.key === "=") zoomTo(scale + 0.5);
      if (e.key === "-") zoomTo(scale - 0.5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, scale, go, zoomTo, onClose]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current) zoomTo(scale * (d / pinchDist.current));
      pinchDist.current = d;
    } else if (scale > 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setPos((p) => clampPos(p.x + dx, p.y + dy, scale));
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    pinchDist.current = 0;
    if (pointers.current.size === 0) setDragging(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-stone-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} zoom`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="text-xs font-semibold tracking-[0.2em] text-white/80">
          {index + 1} / {images.length}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block w-12 text-center text-xs text-white/60">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className={iconBtn}
            onClick={() => zoomTo(scale - 0.5)}
            disabled={scale <= MIN}
            aria-label="Zoom out"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <button
            type="button"
            className={iconBtn}
            onClick={() => zoomTo(scale + 0.5)}
            disabled={scale >= MAX}
            aria-label="Zoom in"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button
            type="button"
            className={iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={boxRef}
        className="relative flex-1 overflow-hidden touch-none select-none"
        style={{
          cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={(e) => zoomTo(scale - e.deltaY * 0.002)}
        onDoubleClick={() => zoomTo(scale > 1 ? 1 : 2.5)}
      >
        <div
          className={`absolute inset-0 ${
            dragging ? "" : "transition-transform duration-200 ease-out"
          }`}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          }}
        >
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            sizes="100vw"
            quality={90}
            priority
            draggable={false}
            className="object-contain p-3 sm:p-8"
          />
        </div>

        {scale === 1 && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/70 whitespace-nowrap">
            Double tap to zoom
          </p>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-17 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-[#faf8f5] transition-all cursor-pointer ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
