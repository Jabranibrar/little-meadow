"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types";
import ImageSlider from "./ImageSlider";
import { getGallery, colorImageIndex } from "../lib/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    size: string,
    qty: number,
    color?: string
  ) => void;
  formatMoney: (amount: number) => string;
}

export default function ProductCard({
  product,
  onAddToCart,
  formatMoney,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] ?? product.sizes[0]
  );
  const [colorName, setColorName] = useState<string | undefined>(
    product.colors[0]?.name
  );
  const gallery = getGallery(product);
  const slideIndex = colorImageIndex(gallery, product, colorName);
  const href = `/product/${product.id}`;
  const soldOut = product.stock !== null && product.stock <= 0;
  const unavailable = soldOut || product.availableSizes.length === 0;

  return (
    <div className="group border border-stone-200/80 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image Section */}
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
          {unavailable && (
            <span className="pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Product Details Section */}
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

          {/* Commented Colors Block Retained As Requested */}
          {/* {product.colors.length > 0 && (
            <div className="mb-3.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Colour
                </span>
                <span className="truncate text-[11px] font-semibold text-stone-700">
                  {colorName}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {product.colors.map((c) => {
                  const selected = colorName === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={`Colour ${c.name}`}
                      aria-pressed={selected}
                      onClick={() => setColorName(c.name)}
                      className={`h-7 w-7 rounded-full p-0.5 transition-all duration-200 cursor-pointer ${
                        selected
                          ? "ring-2 ring-stone-900 ring-offset-2"
                          : "ring-1 ring-stone-300 hover:scale-110 hover:ring-stone-500"
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-white shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* Size Selector */}
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

      {/* Add To Bag Action Button */}
      <div className="p-2.5 sm:p-5 pt-0 sm:pt-0">
        <button
          onClick={() => onAddToCart(product, selectedSize, 1, colorName)}
          disabled={unavailable}
          className="w-full bg-stone-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-stone-800 transition-colors cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {unavailable ? "Out of Stock" : `Add to bag`}
        </button>
      </div>
    </div>
  );
}
