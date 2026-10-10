"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types";
import ImageSlider from "./ImageSlider";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, qty: number) => void;
  formatMoney: (amount: number) => string;
}

const sizes = ["1-2Y", "2-3Y", "3-4Y", "4-5Y"];

export default function ProductCard({
  product,
  onAddToCart,
  formatMoney,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("1-2Y");
  const href = `/product/${product.id}`;
  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <div className="group border border-stone-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative border-b border-stone-100 overflow-hidden">
          <div className={soldOut ? "opacity-50 grayscale-20" : ""}>
            <ImageSlider
              images={product.images}
              alt={product.name}
              href={href}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="aspect-4/3 object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>
          {soldOut && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-stone-900/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
              {product.category}
            </span>
            <span className="font-bold text-stone-900 text-sm sm:text-base">
              {formatMoney(product.price)}
            </span>
          </div>

          <Link href={href}>
            <h4 className="font-serif text-base sm:text-lg text-stone-900 mb-1 hover:underline underline-offset-4 line-clamp-1">
              {product.name}
            </h4>
          </Link>

          <p className="text-xs text-stone-500 mb-4 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>

          <div className="mb-2">
            <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5 tracking-wider">
              Select Size:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  disabled={soldOut}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedSize === sz && !soldOut
                      ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                      : "bg-stone-50/50 text-stone-700 border-stone-200 hover:border-stone-400"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <button
          onClick={() => onAddToCart(product, selectedSize, 1)}
          disabled={soldOut}
          className="w-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {soldOut ? "Out of Stock" : `Add To Bag (${selectedSize})`}
        </button>
      </div>
    </div>
  );
}
