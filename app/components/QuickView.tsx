"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Product } from "../types";
import ImageSlider from "./ImageSlider";
import { getGallery, colorImageIndex } from "../lib/products";

interface QuickViewProps {
  product: Product;
  formatMoney: (n: number) => string;
  onAddToCart: (
    product: Product,
    size: string,
    qty: number,
    color?: string
  ) => void;
  onClose: () => void;
}

export default function QuickView({
  product,
  formatMoney,
  onAddToCart,
  onClose,
}: QuickViewProps) {
  const [size, setSize] = useState<string>(
    product.availableSizes[0] ?? product.sizes[0]
  );
  const [colorName, setColorName] = useState<string | undefined>(
    product.colors[0]?.name
  );
  const gallery = getGallery(product);
  const slideIndex = colorImageIndex(gallery, product, colorName);
  const soldOut = product.stock !== null && product.stock <= 0;
  const unavailable = soldOut || product.availableSizes.length === 0;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-90 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="animate-pop relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-[#faf8f5] shadow-2xl sm:grid-cols-2 sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-stone-900 hover:text-white cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className={unavailable ? "opacity-60 grayscale-20" : ""}>
          <ImageSlider
            images={gallery}
            activeIndex={slideIndex}
            alt={product.name}
            sizes="(max-width: 640px) 100vw, 400px"
            className="w-full aspect-square sm:h-full"
          />
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            {product.category}
          </p>
          <h3 className="mt-1 pr-8 font-serif text-2xl italic leading-tight text-stone-900 sm:text-3xl">
            {product.name}
          </h3>
          <p className="mt-2 text-lg font-bold text-stone-900 sm:text-xl">
            {formatMoney(product.price)}
          </p>

          {product.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
              {product.description}
            </p>
          )}

          {product.colors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Colour:{" "}
                <span className="normal-case tracking-normal text-stone-800">
                  {colorName}
                </span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={`Colour ${c.name}`}
                    aria-pressed={colorName === c.name}
                    onClick={() => setColorName(c.name)}
                    className={`h-7 w-7 rounded-full p-0.5 transition-all cursor-pointer ${
                      colorName === c.name
                        ? "ring-2 ring-stone-900 ring-offset-2"
                        : "ring-1 ring-stone-300 hover:scale-110"
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full border border-white shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => {
                const available =
                  !soldOut && product.availableSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={!available}
                    onClick={() => setSize(sz)}
                    className={`min-w-14 flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                      !available
                        ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300 line-through"
                        : size === sz
                        ? "cursor-pointer border-stone-900 bg-stone-900 text-white"
                        : "cursor-pointer border-stone-200 bg-white text-stone-700 hover:border-stone-900"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 sm:mt-0 sm:pt-6">
            <button
              type="button"
              disabled={unavailable}
              onClick={() => {
                onAddToCart(product, size, 1, colorName);
                onClose();
              }}
              className="w-full rounded-xl bg-stone-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-stone-800 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
            >
              {unavailable ? "Unavailable" : "Add to bag"}
            </button>
            <Link
              href={`/product/${product.id}`}
              className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-600 underline underline-offset-4 hover:text-stone-900"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
