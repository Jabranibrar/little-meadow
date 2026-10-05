"use client";

import Image from "next/image";
import React, { useState } from "react";

type Filter = "all" | "boy" | "girl";

interface NavbarProps {
  totalCount: number;
  onOpenCart: () => void;
  onSelectCategory?: (category: Filter) => void;
}

export default function Navbar({
  totalCount,
  onOpenCart,
  onSelectCategory,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pick = (c: Filter) => {
    onSelectCategory?.(c);
    setMenuOpen(false);
  };

  return (
    <header className="h-20 flex items-center justify-between px-[6%] sticky top-0 z-50 border-b border-stone-200 backdrop-blur-md">
      <a href="#top" className="flex items-center gap-2 group">
        <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center rounded-full">
          <Image
            src="/little-meadow.jpeg"
            alt="Little Meadow Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-stone-900 leading-none">
            Little Meadow
          </span>
          <span className="text-[10px] tracking-widest uppercase text-stone-500 font-medium mt-0.5">
            Kidswear 1-5Y
          </span>
        </div>
      </a>

      <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
        <a href="#shop" className="hover:text-stone-900 transition-colors">
          Collection
        </a>
        <a href="#story" className="hover:text-stone-900 transition-colors">
          Our Story
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCart}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer"
        >
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Bag
          </span>
          <span className="w-5 h-5 bg-stone-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 cursor-pointer"
        >
          <span
            className={`block w-4 h-0.5 bg-stone-900 transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-4 h-0.5 bg-stone-900 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-4 h-0.5 bg-stone-900 transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg px-[6%] py-4 flex flex-col text-xs font-semibold uppercase tracking-wider text-stone-700">
          <a
            href="#shop"
            onClick={() => pick("all")}
            className="py-3 border-b border-stone-100"
          >
            Collection
          </a>
          <a
            href="#shop"
            onClick={() => pick("boy")}
            className="py-3 pl-4 border-b border-stone-100 text-stone-500"
          >
            Boy
          </a>
          <a
            href="#shop"
            onClick={() => pick("girl")}
            className="py-3 pl-4 border-b border-stone-100 text-stone-500"
          >
            Girl
          </a>
          <a href="#story" onClick={() => setMenuOpen(false)} className="py-3">
            Our Story
          </a>
        </nav>
      )}
    </header>
  );
}
