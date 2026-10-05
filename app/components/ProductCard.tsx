"use client";

import React, { useState } from "react";
import { Product } from "../types";
import Image from "next/image";

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

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="relative h-64 bg-stone-100 overflow-hidden border-b border-stone-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest font-medium">
              [ No Image ]
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
              {product.category}
            </span>
            <span className="font-bold text-stone-900 text-sm">
              {formatMoney(product.price)}
            </span>
          </div>
          <h4 className="font-semibold text-base text-stone-900 mb-1">
            {product.name}
          </h4>
          <p className="text-xs text-stone-500 mb-4 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>

          <div className="mb-4">
            <div className="text-[10px] uppercase font-bold text-stone-500 mb-1.5 tracking-wider">
              Select Size:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => onAddToCart(product, selectedSize, 1)}
          className="w-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Add To Bag ({selectedSize})
        </button>
      </div>
    </div>
  );
}
