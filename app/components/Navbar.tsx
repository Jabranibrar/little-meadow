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

  const linkClass =
    "relative hover:text-stone-900 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-stone-900 after:transition-all hover:after:w-full";

  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-[5%] md:px-[6%] sticky top-0 z-50 border-b border-stone-200 backdrop-blur-md">
      <a href="#top" className="flex items-center gap-2.5">
        <div className="relative w-9 h-9 md:w-11 md:h-11 overflow-hidden rounded-full border border-stone-200">
          <Image
            src="/little-meadow.jpeg"
            alt="Little Meadow Logo"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-serif italic text-xl md:text-2xl text-stone-900 leading-none">
            Little Meadow
          </span>
          <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium mt-1">
            Kidswear 1-5Y
          </span>
        </div>
      </a>

      <nav className="hidden md:flex gap-9 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
        <a href="#shop" onClick={() => pick("all")} className={linkClass}>
          Collection
        </a>
        <a href="#shop" onClick={() => pick("boy")} className={linkClass}>
          Boy
        </a>
        <a href="#shop" onClick={() => pick("girl")} className={linkClass}>
          Girl
        </a>
        <a href="#story" className={linkClass}>
          Our Story
        </a>
      </nav>

      <div className="flex items-center gap-2.5 md:gap-3">
        <button
          onClick={onOpenCart}
          aria-label={`Open bag, ${totalCount} items`}
          className="flex items-center gap-2 px-3.5 md:px-4 py-2 rounded-full border border-stone-300 bg-white/80 hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-800 transition-all cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4.5 w-4.5"
            aria-hidden
          >
            <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
            <path d="M9 10V7a3 3 0 0 1 6 0v3" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            Bag
          </span>
          {totalCount > 0 && (
            <span className="min-w-5 h-5 px-1 bg-stone-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white/80 cursor-pointer"
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
        <>
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 -z-10"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg px-[5%] py-3 flex flex-col text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
            <a
              href="#shop"
              onClick={() => pick("all")}
              className="py-3.5 border-b border-stone-100"
            >
              Collection
            </a>
            <a
              href="#shop"
              onClick={() => pick("boy")}
              className="py-3.5 pl-4 border-b border-stone-100 text-stone-500"
            >
              Boy
            </a>
            <a
              href="#shop"
              onClick={() => pick("girl")}
              className="py-3.5 pl-4 border-b border-stone-100 text-stone-500"
            >
              Girl
            </a>
            <a
              href="#story"
              onClick={() => setMenuOpen(false)}
              className="py-3.5"
            >
              Our Story
            </a>
          </nav>
        </>
      )}
    </header>
  );
}
