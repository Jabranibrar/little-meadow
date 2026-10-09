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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-stone-400 shrink-0"
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
            placeholder="Search by collection, dress name, or category..."
            className="w-full text-stone-900 placeholder:text-stone-400 text-sm sm:text-base outline-none bg-transparent font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-stone-400 hover:text-stone-700 uppercase tracking-wider font-semibold bg-stone-100 px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 p-1 text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 flex-1">
          {query.trim() === "" ? (
            <div className="text-center py-12 text-stone-400 text-xs uppercase tracking-widest font-medium">
              Start typing to search Little Meadow collection...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
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
                  className="py-3 flex items-center justify-between hover:bg-stone-50 px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
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
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm group-hover:text-stone-700 transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-sm font-bold text-stone-900 block">
                        {formatMoney(product.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 group-hover:text-stone-900 mt-0.5 inline-block">
                        View details
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-white text-stone-600 flex items-center justify-center transition-all">
                      <svg
                        className="w-4 h-4"
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

        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 text-center text-[11px] text-stone-500">
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
