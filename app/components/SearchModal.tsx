"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "../types";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  formatMoney: (amount: number) => string;
  onSelectProduct: (product: Product) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  products,
  formatMoney,
  onSelectProduct,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => setQuery(""), 150);
      return () => clearTimeout(resetTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredProducts =
    query.trim() === ""
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input Area */}
        <div className="p-3.5 sm:p-5 border-b border-stone-100 flex items-center gap-2.5 sm:gap-3 bg-white sticky top-0 z-10">
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-stone-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, collection, categories..."
            className="w-full text-stone-900 placeholder:text-stone-400 text-xs sm:text-base outline-none bg-transparent font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[10px] sm:text-xs text-stone-500 hover:text-stone-900 uppercase tracking-wider font-semibold bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-100 text-lg transition-colors shrink-0 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-2.5 flex-1">
          {query.trim() === "" ? (
            <div className="text-center py-10 sm:py-14 text-stone-400 text-[11px] sm:text-xs uppercase tracking-widest font-medium px-4">
              Start typing to search Little Meadow collection...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 sm:py-14 text-stone-500 text-xs sm:text-sm px-4">
              No matching pieces found for{" "}
              <span className="font-semibold text-stone-800">
                &ldquo;{query}&rdquo;
              </span>
              .
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="py-2.5 sm:py-3 flex items-center justify-between gap-3 hover:bg-stone-50 px-2.5 sm:px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                          Img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-stone-900 text-xs sm:text-sm group-hover:text-stone-700 transition-colors truncate">
                        {product.name}
                      </h4>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                        {formatMoney(product.price)}
                      </span>
                      <span className="hidden sm:inline-block text-[11px] font-semibold text-stone-500 group-hover:text-stone-900 mt-0.5">
                        View details
                      </span>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white text-stone-600 flex items-center justify-center transition-all">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="bg-stone-50 px-4 sm:px-6 py-2.5 sm:py-3 border-t border-stone-100 text-center text-[10px] sm:text-[11px] text-stone-500">
          Tip: Press{" "}
          <kbd className="bg-white border border-stone-300 px-1.5 py-0.5 rounded shadow-2xs font-mono">
            ESC
          </kbd>{" "}
          to close search.
        </div>
      </div>
    </div>
  );
}
