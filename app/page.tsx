"use client";

import React, { useState, useEffect } from "react";
import { Product } from "./types";
import { supabase } from "./lib/supabase";
import { useCart } from "./context/CartContext";
import { mapProduct, SupabaseProductRow } from "./lib/products";
import Navbar from "./components/Navbar";
import HeroComponent from "./components/Hero";
import ProductCard from "./components/ProductCard";
import { ProductSkeletonGrid } from "./components/ProductSkeleton";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalCount, openCart, addToCart, formatMoney } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const [category, setCategory] = useState<"all" | "boy" | "girl">(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("lm_filter") as
        | "all"
        | "boy"
        | "girl"
        | null;
      if (saved) {
        return saved;
      }
    }
    return "all";
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("lm_filter");
    if (saved) {
      setTimeout(() => {
        const shopEl = document.querySelector("#shop");
        if (shopEl) {
          shopEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const visibleProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts((data as SupabaseProductRow[]).map(mapProduct));
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      <Navbar
        totalCount={totalCount}
        onOpenCart={openCart}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => {
          setCategory(cat);
          sessionStorage.setItem("lm_filter", cat);
        }}
      />

      <HeroComponent />

      <section
        id="story"
        className="relative py-7 md:py-14 px-6 md:px-12 border-b border-stone-200 text-stone-800 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pink-200/50"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-[11px] uppercase tracking-[0.25em] font-bold text-stone-600 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-stone-200 shadow-xs mb-5">
            Our Story
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-stone-900 tracking-wide mb-4 sm:mb-6">
            Where little dreams begin.
          </h2>

          <p className="text-base md:text-lg text-stone-700 font-normal leading-relaxed mb-6">
            Some of the most beautiful stories begin quietly.
            <br />
            Ours began with two little names —{" "}
            <strong className="text-stone-900 font-medium">Ayra & Hadin</strong>
            .
          </p>

          <div className="w-10 h-px bg-stone-300 mx-auto my-4 md:my-6"></div>

          <div className="space-y-4 text-stone-700 text-sm md:text-base leading-relaxed text-left md:text-center max-w-2xl mx-auto">
            <p>
              They inspired us to see childhood through different eyes: softer,
              brighter, and filled with little moments worth remembering.
            </p>
            <p className="font-medium text-stone-900 text-center py-1">
              Little Meadow was created from that feeling.
            </p>
          </div>

          <div className="my-8 p-5 bg-white/90 backdrop-blur rounded-xl border border-stone-200 shadow-xs max-w-xl mx-auto">
            <p className="text-stone-900 font-serif italic text-lg md:text-xl">
              &ldquo;Childhood is fleeting. Make every little moment
              beautiful.&rdquo;
            </p>
          </div>

          <div className="pt-5 border-t border-stone-200/80 inline-block px-8">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">
              With love,
            </p>
            <p className="font-serif font-medium text-stone-900 text-base mb-2">
              Mama & Baba of Ayra & Hadin
            </p>
            <p className="text-xs font-semibold tracking-wider text-stone-800">
              Little Meadow by Ayra & Hadin
            </p>
          </div>
        </div>
      </section>

      <section
        id="shop"
        className="py-6 sm:py-9 md:py-24 px-[6%] max-w-7xl mx-auto"
      >
        <div className="text-center mb-6 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-3">
            New Collection (1–5 Years)
          </h2>
          <p className="text-stone-500 text-sm md:text-base">
            Pick your preferred size directly from the cards below and proceed
            to instant order.
          </p>
        </div>

        {loading ? (
          <ProductSkeletonGrid />
        ) : visibleProducts.length === 0 ? (
          <p className="text-center text-stone-400 py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                formatMoney={formatMoney}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        formatMoney={formatMoney}
        onSelectProduct={(product) => {
          router.push(`/product/${product.id}`);
        }}
      />
    </div>
  );
}
