"use client";

import React, { useState, useEffect } from "react";
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
          category: item.category || "unisex",
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
        className="bg-[#faf8f5] py-20 px-[8%] text-center border-b border-stone-200"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-3">
            Our Philosophy
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-stone-800 font-normal">
            <strong>Little Meadow</strong> brings premium fabrics for kids aged
            1 to 5 years. Designed for comfort, styled for everyday play and
            joyful moments.
          </p>
        </div>
      </section>

      <section id="shop" className="py-24 px-[6%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-3">
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

      <footer className="py-12 text-center bg-[#faf8f5] border-t border-stone-200 text-stone-500 text-xs">
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
