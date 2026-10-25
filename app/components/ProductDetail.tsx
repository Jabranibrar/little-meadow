"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { DELIVERY_DAYS } from "../lib/config";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ImageSlider from "./ImageSlider";
import SearchModal from "./SearchModal";
import { getGallery, colorImageIndex } from "../lib/products";

interface ProductDetailProps {
  product: Product;
  allProducts?: Product[];
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-[#faf8f5] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-800">{value}</p>
    </div>
  );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { totalCount, openCart, addToCart, formatMoney } = useCart();
  const [size, setSize] = useState<string>(
    product.availableSizes[0] ?? product.sizes[0]
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [colorName, setColorName] = useState<string | undefined>(
    product.colors[0]?.name
  );
  const gallery = getGallery(product);
  const slideIndex = colorImageIndex(gallery, product, colorName);
  const router = useRouter();

  const soldOut = product.stock !== null && product.stock <= 0;
  const unavailable = soldOut || product.availableSizes.length === 0;

  const tiles = [
    { label: "Fabric", value: product.fabric },
    { label: "Occasion", value: product.occasion },
    { label: "Includes", value: product.pieces },
    { label: "Size Range", value: product.sizes.join("  ·  ") },
    { label: "Care", value: product.care },
  ].filter((t) => t.value);

  return (
    <div className="min-h-screen text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      <Navbar
        totalCount={totalCount}
        onOpenCart={openCart}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-[5%] md:px-[6%] py-6 sm:py-10 md:py-14">
        <Link
          href="/#shop"
          className="group inline-flex items-center gap-3 mb-5 sm:mb-8 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 hover:text-stone-900 transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/80 backdrop-blur-xs shadow-2xs transition-all group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </span>
          <span className="relative">
            Back to Collection
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-stone-900 transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        <div className="grid gap-8 md:grid-cols-2 md:gap-14 items-start">
          {/* Gallery */}
          <div className="md:sticky md:top-28 relative">
            <div className={unavailable ? "opacity-60 grayscale-20" : ""}>
              <ImageSlider
                images={gallery}
                activeIndex={slideIndex}
                alt={product.name}
                priority
                zoomable
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-4/3 rounded-2xl border border-stone-200 shadow-2xs"
              />
            </div>
            {unavailable && (
              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-stone-900/90 backdrop-blur-xs px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Info */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200 shadow-2xs p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-pink-100/70 text-stone-700 rounded-md">
                {product.category}
              </span>
              {unavailable ? (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-stone-100 text-stone-500 rounded-md">
                  Out of stock
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                  In stock
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-serif italic text-stone-900 leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-xl sm:text-2xl font-bold text-stone-900">
              {formatMoney(product.price)}
            </p>

            <div className="w-12 h-px bg-stone-300 my-6" />

            {product.description && (
              <p className="text-sm sm:text-base leading-relaxed text-stone-700">
                {product.description}
              </p>
            )}

            {/* Colours */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <div className="text-[11px] uppercase font-bold text-stone-500 mb-2 tracking-wider">
                  Colour:{" "}
                  <span className="normal-case tracking-normal text-stone-800">
                    {colorName}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColorName(c.name)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        colorName === c.name
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-stone-300 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {/* <div className="mt-6">
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-2 tracking-wider">
                Size
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const available =
                    !soldOut && product.availableSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={!available}
                      title={available ? undefined : "Not available"}
                      onClick={() => setSize(sz)}
                      className={`min-w-16 flex-1 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                        !available
                          ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300 line-through"
                          : size === sz
                          ? "cursor-pointer bg-stone-900 text-white border-stone-900 shadow-2xs"
                          : "cursor-pointer bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div> */}

            <button
              onClick={() => addToCart(product, size, 1, colorName)}
              disabled={unavailable}
              className="mt-6 w-full bg-stone-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
            >
              {unavailable ? "Out of Stock" : `Add To Bag`}
            </button>

            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-200 pt-5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Cash on Delivery available
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Order confirmation on WhatsApp
              </li>
            </ul>
          </div>
        </div>

        {/* Product details */}
        {(tiles.length > 0 || product.highlights.length > 0) && (
          <section className="mt-10 sm:mt-14 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-xs shadow-2xs p-5 sm:p-8 md:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-stone-500 mb-2">
                The Details
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-stone-900">
                About this piece
              </h2>
              <div className="w-12 h-px bg-stone-400 mx-auto mt-5" />
            </div>

            {tiles.length > 0 && (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {tiles.map((t) => (
                  <Tile key={t.label} label={t.label} value={t.value} />
                ))}
              </div>
            )}

            {product.highlights.length > 0 && (
              <div className="mt-6 sm:mt-8 rounded-xl bg-pink-100/50 border border-pink-200/60 p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">
                  Highlights
                </p>
                <ul className="space-y-3">
                  {product.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm sm:text-base text-stone-700 leading-relaxed"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white border border-stone-200">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-stone-800"
                          aria-hidden
                        >
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Delivery and exchange */}
        <section className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white/80 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Payment
            </p>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              Cash on Delivery across Pakistan.
            </p>
          </div>
          <Link
            href="/delivery-info"
            className="group rounded-xl border border-stone-200 bg-white/80 p-5 transition-all hover:border-stone-400 hover:shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Delivery
            </p>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              Delivered in {DELIVERY_DAYS}.{" "}
              <span className="underline underline-offset-4 group-hover:text-stone-900">
                Delivery info
              </span>
            </p>
          </Link>
          <Link
            href="/privacy-policy"
            className="group rounded-xl border border-stone-200 bg-white/80 p-5 transition-all hover:border-stone-400 hover:shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Exchange
            </p>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              Easy size exchange within 7 days.{" "}
              <span className="underline underline-offset-4 group-hover:text-stone-900">
                Read policy
              </span>
            </p>
          </Link>
        </section>
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={[product]}
        formatMoney={formatMoney}
        onSelectProduct={(selectedProduct) => {
          router.push(`/product/${selectedProduct.id}`);
        }}
      />
    </div>
  );
}
