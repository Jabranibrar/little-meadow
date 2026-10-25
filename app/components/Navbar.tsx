"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Filter =
  | "all"
  | "boy"
  | "girl"
  | "newborn"
  | "frocks"
  | "jackets"
  | "boy-limited"
  | "girl-limited"
  | "limited";

interface NavbarProps {
  totalCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onSelectCategory?: (category: Filter) => void;
}

export default function Navbar({
  totalCount,
  onOpenCart,
  onOpenSearch,
  onSelectCategory,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGirlOpen, setMobileGirlOpen] = useState(false);
  const [mobileBoyOpen, setMobileBoyOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (hash: string, category: Filter) => {
    setMenuOpen(false);
    setMobileGirlOpen(false);
    setMobileBoyOpen(false);

    sessionStorage.setItem("lm_filter", category);
    if (onSelectCategory) {
      onSelectCategory(category);
    }

    if (pathname !== "/") {
      router.push(`/${hash}`);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/${hash}`);
      }
    }
  };

  const linkClass =
    "relative hover:text-stone-900 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-stone-900 after:transition-all hover:after:w-full cursor-pointer";

  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-[5%] md:px-[6%] sticky top-0 z-50 border-b border-stone-200 backdrop-blur-md">
      {/* Brand Logo */}
      <Link
        href="/"
        onClick={() => {
          sessionStorage.setItem("lm_filter", "all");
          onSelectCategory?.("all");
        }}
        className="flex items-center gap-2.5 group"
      >
        <div className="relative w-9 h-9 md:w-11 md:h-11 overflow-hidden rounded-full border border-stone-200 group-hover:border-stone-400 transition-colors">
          <Image
            src="/little-meadow.jpeg"
            alt="Little Meadow Logo"
            fill
            sizes="(max-width: 768px) 36px, 44px"
            priority
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-serif italic sm:text-xl md:text-2xl text-stone-900 leading-none">
            Little Meadow
          </span>
          <span className="hidden min-[480px]:block text-[10px] tracking-[0.25em] uppercase text-stone-500 font-medium mt-1">
            Kidswear 1-5Y
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
        <button
          onClick={() => handleNavClick("#shop", "all")}
          className={linkClass}
        >
          Collection
        </button>

        {/* Desktop Boy Dropdown */}
        <div className="relative group inline-flex items-center py-2 cursor-pointer">
          <div className={`${linkClass} inline-flex items-center gap-1.5`}>
            <span>Boy</span>
            <svg
              className="w-3 h-3 text-stone-400 group-hover:text-stone-900 transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50 flex flex-col text-[11px] font-medium tracking-wider">
            <button
              onClick={() => handleNavClick("#shop", "boy")}
              className="px-4 py-2.5 text-left text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-t-xl"
            >
              All Boy Collection
            </button>
            <div className="h-px bg-stone-100 mx-3" />
            <button
              onClick={() => handleNavClick("#shop", "jackets")}
              className="px-4 py-2.5 text-left text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            >
              Jackets &amp; Outerwear
            </button>
            <div className="h-px bg-stone-100 mx-3" />
            <button
              onClick={() => handleNavClick("#shop", "boy-limited")}
              className="px-4 py-2.5 text-left text-amber-800 hover:text-amber-900 hover:bg-amber-50/50 transition-colors rounded-b-xl flex items-center justify-between"
            >
              <span>Limited Stock</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* Desktop Girl Dropdown */}
        <div className="relative group inline-flex items-center py-2 cursor-pointer">
          <div className={`${linkClass} inline-flex items-center gap-1.5`}>
            <span>Girl</span>
            <svg
              className="w-3 h-3 text-stone-400 group-hover:text-stone-900 transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50 flex flex-col text-[11px] font-medium tracking-wider">
            <button
              onClick={() => handleNavClick("#shop", "girl")}
              className="px-4 py-2.5 text-left text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors rounded-t-xl"
            >
              All Girl Collection
            </button>
            <div className="h-px bg-stone-100 mx-3" />
            <button
              onClick={() => handleNavClick("#shop", "frocks")}
              className="px-4 py-2.5 text-left text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            >
              Frocks &amp; Dresses
            </button>
            <div className="h-px bg-stone-100 mx-3" />
            <button
              onClick={() => handleNavClick("#shop", "jackets")}
              className="px-4 py-2.5 text-left text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            >
              Jackets &amp; Outerwear
            </button>
            <div className="h-px bg-stone-100 mx-3" />
            <button
              onClick={() => handleNavClick("#shop", "girl-limited")}
              className="px-4 py-2.5 text-left text-amber-800 hover:text-amber-900 hover:bg-amber-50/50 transition-colors rounded-b-xl flex items-center justify-between"
            >
              <span>Limited Stock</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </button>
          </div>
        </div>

        <button
          onClick={() => handleNavClick("#shop", "newborn")}
          className={linkClass}
        >
          Newborn
        </button>

        <button
          onClick={() => {
            setMenuOpen(false);
            if (pathname !== "/") {
              router.push("/#story");
            } else {
              document
                .querySelector("#story")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={linkClass}
        >
          Our Story
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 md:gap-3">
        <button
          onClick={onOpenSearch}
          aria-label="Open search"
          className="w-10 h-10 rounded-full border border-stone-300 bg-white/80 hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-800 transition-all flex items-center justify-center cursor-pointer"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

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
            <span
              key={totalCount}
              className="animate-bump min-w-5 h-5 px-1 bg-stone-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center"
            >
              {totalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white/80 cursor-pointer"
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

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/20 -z-10"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-b border-stone-200 shadow-xl px-[6%] py-2 flex flex-col text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 max-h-[75vh] overflow-y-auto">
            <button
              onClick={() => handleNavClick("#shop", "all")}
              className="py-3.5 border-b border-stone-100 text-left hover:text-stone-900 transition-colors"
            >
              Collection
            </button>

            {/* Mobile Boy Accordion Section */}
            <div className="border-b border-stone-100">
              <div
                onClick={() => setMobileBoyOpen(!mobileBoyOpen)}
                className="flex items-center justify-between py-3.5 pl-4 cursor-pointer"
              >
                <span className="text-stone-600 text-left flex-1">Boy</span>

                <button
                  type="button"
                  aria-label="Toggle Boy subcategories"
                  className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-600 transition-all shrink-0 leading-none"
                >
                  <span className="text-sm font-semibold flex items-center justify-center leading-none translate-y-[-0.5px] ml-0.5">
                    {mobileBoyOpen ? "−" : "+"}
                  </span>
                </button>
              </div>

              {mobileBoyOpen && (
                <div className="ml-4 mb-3.5 pl-4 border-l-2 border-stone-200 flex flex-col space-y-2.5 py-1">
                  <button
                    onClick={() => handleNavClick("#shop", "boy")}
                    className="text-left text-[11px] font-medium tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    All Boy Collection
                  </button>
                  <button
                    onClick={() => handleNavClick("#shop", "jackets")}
                    className="text-left text-[11px] font-medium tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Jackets &amp; Outerwear
                  </button>
                  <button
                    onClick={() => handleNavClick("#shop", "boy-limited")}
                    className="text-left text-[11px] font-medium tracking-wider text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1.5"
                  >
                    <span>Limited Stock</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Girl Accordion Section */}
            <div className="border-b border-stone-100">
              <div
                onClick={() => setMobileGirlOpen(!mobileGirlOpen)}
                className="flex items-center justify-between py-3.5 pl-4 cursor-pointer"
              >
                <span className="text-stone-600 text-left flex-1">Girl</span>

                <button
                  type="button"
                  aria-label="Toggle Girl subcategories"
                  className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-600 transition-all shrink-0 leading-none"
                >
                  <span className="text-sm font-semibold flex items-center justify-center leading-none translate-y-[-0.5px] ml-0.5">
                    {mobileGirlOpen ? "−" : "+"}
                  </span>
                </button>
              </div>

              {mobileGirlOpen && (
                <div className="ml-4 mb-3.5 pl-4 border-l-2 border-stone-200 flex flex-col space-y-2.5 py-1">
                  <button
                    onClick={() => handleNavClick("#shop", "girl")}
                    className="text-left text-[11px] font-medium tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    All Girl Collection
                  </button>
                  <button
                    onClick={() => handleNavClick("#shop", "frocks")}
                    className="text-left text-[11px] font-medium tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Frocks &amp; Dresses
                  </button>
                  <button
                    onClick={() => handleNavClick("#shop", "jackets")}
                    className="text-left text-[11px] font-medium tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Jackets &amp; Outerwear
                  </button>
                  <button
                    onClick={() => handleNavClick("#shop", "girl-limited")}
                    className="text-left text-[11px] font-medium tracking-wider text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1.5"
                  >
                    <span>Limited Stock</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick("#shop", "newborn")}
              className="py-3.5 pl-4 border-b border-stone-100 text-stone-600 text-left hover:text-stone-900 transition-colors"
            >
              Newborn
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                if (pathname !== "/") {
                  router.push("/#story");
                } else {
                  document
                    .querySelector("#story")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="py-3.5 text-left hover:text-stone-900 transition-colors"
            >
              Our Story
            </button>
          </nav>
        </>
      )}
    </header>
  );
}
