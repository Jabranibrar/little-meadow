"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, CartItem, CheckoutFormData } from "./types";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

interface SupabaseProductRow {
  id: number | string;
  title?: string;
  name?: string;
  price: number;
  desc?: string;
  category?: string;
  image?: string;
  stock?: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        // Proper typing use ki hai bina 'any' ke
        const rows: SupabaseProductRow[] = data;
        const formattedProducts: Product[] = rows.map((item) => ({
          id: Number(item.id),
          name: item.title || item.name || "Untitled Product",
          price: item.price,
          desc:
            item.desc ||
            `Category: ${item.category || "General"} | Stock: ${
              item.stock ?? "Available"
            }`,
          category: (["boy", "girl", "unisex"].includes(item.category ?? "")
            ? item.category
            : "unisex") as Product["category"],
          image: item.image || "",
        }));

        setProducts(formattedProducts);
      }
    }

    fetchProducts();
  }, []);

  const money = (n: number): string => "PKR " + n.toLocaleString("en-PK");

  const addToCart = (product: Product, size: string, qty: number) => {
    const key = product.id + "-" + size;
    setCart((prevCart) => {
      const found = prevCart.find((x) => x.key === key);
      if (found) {
        return prevCart.map((x) =>
          x.key === key ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prevCart,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          size,
          qty,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const changeQty = (key: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const removeItem = (key: string) => {
    setCart((prevCart) => prevCart.filter((x) => x.key !== key));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckoutSubmit = (formData: CheckoutFormData) => {
    const orderId = "LM-" + Date.now().toString().slice(-7);

    let msg = `🛍 *NEW ORDER RECEIVED - LITTLE MEADOW* \n\n`;
    msg += `🆔 *Order ID:* ${orderId}\n`;
    msg += `👤 *Name:* ${formData.name}\n`;
    msg += `📞 *Phone:* ${formData.phone}\n`;
    msg += `📧 *Email:* ${formData.email}\n`;
    msg += `🏙 *City:* ${formData.city}\n`;
    msg += `📍 *Address:* ${formData.address}\n`;
    msg += `💰 *Payment:* ${formData.payment}\n\n`;
    msg += `📦 *Items Ordered:*\n`;

    cart.forEach((item, index) => {
      msg += `${index + 1}. ${item.name} (Size: ${item.size}) x ${
        item.qty
      } = ${money(item.price * item.qty)}\n`;
    });

    msg += `\n*Total Amount:* ${money(totalAmount)}`;

    const whatsappNumber = "923046133091";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      msg
    )}`;

    window.open(url, "_blank");
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      <Navbar totalCount={totalCount} onOpenCart={() => setIsCartOpen(true)} />

      <Hero />

      <section
        id="story"
        className="relative py-7 md:py-14 px-6 md:px-12 border-b border-stone-200 text-stone-800 overflow-hidden bg-stone-900"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/little-meadow.jpeg"
            alt="Little Meadow Background"
            fill
            priority
            className="object-cover scale-105 transform"
          />
          <div className="absolute inset-0 bg-[#faf8f5]/90"></div>
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
              brighter, and filled with little moments worth remembering. The
              tiny hands reaching for us, the dresses chosen for special
              mornings, the laughter that fills a room, and the fleeting days we
              wish we could hold onto forever.
            </p>
            <p className="font-medium text-stone-900 text-center py-1">
              Little Meadow was created from that feeling.
            </p>
            <p>
              A world where childhood meets thoughtful design — where every
              piece is made to feel as beautiful as it looks, while leaving room
              for children to simply be children.
            </p>
            <p>
              We believe children&apos;s clothing should carry a sense of
              wonder. It should be comfortable enough for play, beautiful enough
              for celebrations, and timeless enough to become part of treasured
              memories.
            </p>
            <p>
              From delicate details to thoughtful silhouettes, every Little
              Meadow piece is chosen with one simple thought in mind:
            </p>
          </div>

          <div className="my-8 p-5 bg-white/90 backdrop-blur rounded-xl border border-stone-200 shadow-xs max-w-xl mx-auto">
            <p className="text-stone-900 font-serif italic text-lg md:text-xl">
              &ldquo;Childhood is fleeting. Make every little moment
              beautiful.&rdquo;
            </p>
          </div>

          <div className="space-y-4 text-stone-700 text-sm md:text-base leading-relaxed text-left md:text-center max-w-2xl mx-auto mb-0 md:mb-8">
            <p>
              Ayra and Hadin may be the inspiration behind our name, but every
              little one who wears Little Meadow becomes part of our story.
            </p>
            <p className="text-stone-900 font-medium">
              So, welcome to our little meadow —<br />a place for little dreams,
              beautiful beginnings, and memories in the making.
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
            <p className="text-[11px] text-stone-500 mt-1 italic">
              Made for little moments. Made to be remembered.
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

        {products.length === 0 ? (
          <p className="text-center text-stone-400 py-12">
            Loading products from Supabase...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                formatMoney={money}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="py-6 sm:py-9 md:py-12 text-center bg-[#faf8f5] border-t border-stone-200 text-stone-500 text-xs">
        <div className="font-bold text-stone-900 mb-1 text-sm">
          Little Meadow
        </div>
        <p className="mb-2">Thoughtful kidswear for daily adventures.</p>
        <p className="text-stone-400">
          © 2026 Little Meadow. All rights reserved. · hello@littlemeadow.pk
        </p>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onChangeQty={changeQty}
        onRemoveItem={removeItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        formatMoney={money}
        totalAmount={totalAmount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleCheckoutSubmit}
      />
    </div>
  );
}
