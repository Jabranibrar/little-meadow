"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types";
import ImageSlider from "./ImageSlider";
import { getGallery, colorImageIndex } from "../lib/products";
import QuickView from "./QuickView";

interface ProductCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    size: string,
    qty: number,
    color?: string
  ) => void;
  formatMoney: (amount: number) => string;
  rating?: { average: number; count: number };
}

export default function ProductCard({
  product,
  onAddToCart,
  formatMoney,
  rating,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] ?? product.sizes[0]
  );
  const [colorName, setColorName] = useState<string | undefined>(
    product.colors[0]?.name
  );
  const [quickOpen, setQuickOpen] = useState(false);
  const gallery = getGallery(product);
  const slideIndex = colorImageIndex(gallery, product, colorName);
  const href = `/product/${product.id}`;
  const soldOut = product.stock !== null && product.stock <= 0;
  const unavailable = soldOut || product.availableSizes.length === 0;

  const hasRating = !!rating && rating.count > 0;
  const loved = hasRating && rating!.average >= 4.5 && rating!.count >= 3;

  return (
    <div className="group h-full border border-stone-200/80 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative border-b border-stone-100 overflow-hidden">
          <div className={unavailable ? "opacity-50 grayscale-20" : ""}>
            <ImageSlider
              images={gallery}
              activeIndex={slideIndex}
              alt={product.name}
              href={href}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="aspect-square sm:aspect-4/3 object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            aria-label="Quick view"
            className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-stone-900 hover:text-white cursor-pointer lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {unavailable ? (
            <span className="pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              Sold Out
            </span>
          ) : (
            hasRating && (
              <span
                role="img"
                aria-label={`Rated ${rating!.average.toFixed(
                  1
                )} out of 5 from ${rating!.count} ${
                  rating!.count === 1 ? "review" : "reviews"
                }`}
                className={`pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 z-10 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] sm:text-xs font-bold text-stone-800 shadow-sm backdrop-blur-sm ${
                  loved
                    ? "border-amber-200 bg-amber-50/95"
                    : "border-white/70 bg-white/90"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500"
                  aria-hidden
                >
                  <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                </svg>
                {rating!.average.toFixed(1)}
                <span className="h-3 w-px bg-stone-300" />
                <span className="font-medium text-stone-500">
                  {rating!.count}
                </span>
              </span>
            )
          )}
        </div>

        <div className="p-2.5 sm:p-5">
          <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-md truncate max-w-[55%]">
              {product.category}
            </span>
            <span className="font-bold text-stone-900 text-xs sm:text-base shrink-0">
              {formatMoney(product.price)}
            </span>
          </div>

          <Link href={href}>
            <h4 className="text-xs sm:text-lg text-stone-900 mb-1 hover:underline underline-offset-4 line-clamp-1">
              {product.name}
            </h4>
          </Link>

          <p className="text-[11px] sm:text-xs text-stone-500 mb-2.5 sm:mb-4 line-clamp-2 leading-snug sm:leading-relaxed">
            {product.desc}
          </p>

          <div className="mb-1 sm:mb-2">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-400 mb-1 sm:mb-1.5 tracking-wider">
              Size:
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {product.sizes.map((sz) => {
                const available =
                  !soldOut && product.availableSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={!available}
                    title={available ? undefined : "Not available"}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-8 sm:min-w-13 flex-1 px-1 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg border transition-all ${
                      !available
                        ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300 line-through"
                        : selectedSize === sz
                        ? "cursor-pointer bg-stone-900 text-white border-stone-900 shadow-2xs"
                        : "cursor-pointer bg-stone-50/50 text-stone-700 border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2.5 sm:p-5 pt-0 sm:pt-0">
        <button
          onClick={() => onAddToCart(product, selectedSize, 1, colorName)}
          disabled={unavailable}
          className="w-full bg-stone-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-stone-800 transition-colors cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {unavailable ? "Out of Stock" : `Add to bag`}
        </button>
      </div>

      {quickOpen && (
        <QuickView
          product={product}
          formatMoney={formatMoney}
          onAddToCart={onAddToCart}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </div>
  );
}
