import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#faf8f5]/10 backdrop-blur-sm border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-[6%] py-8 sm:py-12 md:py-16">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-14 h-14 overflow-hidden rounded-full border border-stone-200">
            <Image
              src="/little-meadow.jpeg"
              alt="Little Meadow Logo"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="mt-4 text-2xl md:text-3xl font-serif italic text-stone-900">
            Little Meadow
          </h3>
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-500 mt-1">
            by Ayra &amp; Hadin
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-600">
            Thoughtful kidswear for daily adventures. Made for little moments.
            Made to be remembered.
          </p>
        </div>

        <nav className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600">
          <a href="#shop" className="hover:text-stone-900 transition-colors">
            Collection
          </a>
          <a href="#story" className="hover:text-stone-900 transition-colors">
            Our Story
          </a>
          <Link
            href="/exchange-policy"
            className="hover:text-stone-900 transition-colors"
          >
            Exchange &amp; Return Policy
          </Link>
        </nav>

        <div className="w-12 h-px bg-stone-300 mx-auto my-6 sm:my-8" />
        <div className="flex justify-center mb-6">
          <Link
            href="https://www.instagram.com/littlemeadow_a.h"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Little Meadow on Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2 text-xs text-stone-500 text-center">
          <a
            href="mailto:hello@littlemeadow.pk"
            className="hover:text-stone-900 transition-colors"
          >
            hello@littlemeadow.pk
          </a>
          <p className="text-stone-400">
            © 2026 Little Meadow. All rights reserved.
          </p>
          <p className="font-serif italic text-sm text-stone-500 mt-1">
            Made with love for little moments.
          </p>
        </div>
      </div>
    </footer>
  );
}
