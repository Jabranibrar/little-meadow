"use client";

import React from "react";

interface NavbarProps {
  totalCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ totalCount, onOpenCart }: NavbarProps) {
  return (
    <header className="h-20 flex items-center justify-between px-[6%] bg-white/90 sticky top-0 z-50 border-b border-stone-200 backdrop-blur-md">
      <a href="#top" className="flex items-center gap-2 group">
        <div className="w-9 h-9 bg-stone-900 text-white rounded-lg flex items-center justify-center font-bold text-sm tracking-tighter">
          LM
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
    </header>
  );
}
