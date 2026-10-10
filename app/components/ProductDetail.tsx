"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ImageSlider from "./ImageSlider";
import SearchModal from "./SearchModal";
import { useRouter } from "next/navigation";

const sizes = ["1-2Y", "2-3Y", "3-4Y", "4-5Y"];

interface ProductDetailProps {
  product: Product;
  allProducts?: Product[];
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { totalCount, openCart, addToCart, formatMoney } = useCart();
  const [size, setSize] = useState<string>("1-2Y");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const soldOut = product.stock !== null && product.stock <= 0;

  return (
    <div className="min-h-screen text-stone-900 font-sans">
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/80 backdrop-blur-sm shadow-sm transition-all group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white">
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
          <div className="md:sticky md:top-28">
            <ImageSlider
              images={product.images}
              alt={product.name}
              priority
              zoomable
              sizes="(max-width: 768px) 100vw, 50vw"
              className="aspect-4/5 rounded-2xl border border-stone-200 shadow-sm"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-8">
            <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-stone-100 text-stone-600 rounded">
              {product.category}
            </span>

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

            <div className="mt-6">
              <div className="text-[11px] uppercase font-bold text-stone-500 mb-2 tracking-wider">
                Select Size
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSize(sz)}
                    className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                      size === sz
                        ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, size, 1)}
              disabled={soldOut}
              className="mt-6 w-full bg-stone-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed disabled:hover:bg-stone-300"
            >
              {soldOut ? "Sold Out" : `Add To Bag (${size})`}
            </button>

            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-200 pt-5">
              <li>Cash on Delivery available</li>
              <li>Order confirmation on WhatsApp</li>
              <li>
                Easy size exchange within 7 days.{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-4 hover:text-stone-900"
                >
                  Read policy
                </Link>
              </li>
              <li>
                Delivery in 3-5 working days.{" "}
                <Link
                  href="/delivery-info"
                  className="underline underline-offset-4 hover:text-stone-900"
                >
                  Delivery info
                </Link>
              </li>
            </ul>
          </div>
        </div>
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
