"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem, CheckoutFormData } from "../types";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";

interface CartContextValue {
  totalCount: number;
  openCart: () => void;
  addToCart: (product: Product, size: string, qty: number) => void;
  formatMoney: (n: number) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const locked = isCartOpen || isCheckoutOpen || !!orderSuccess;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isCheckoutOpen, orderSuccess]);

  const formatMoney = (n: number): string => "PKR " + n.toLocaleString("en-PK");

  const addToCart = (product: Product, size: string, qty: number) => {
    const key = product.id + "-" + size;
    setCart((prev) => {
      const found = prev.find((x) => x.key === key);
      if (found) {
        return prev.map((x) =>
          x.key === key ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          qty,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const changeQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const removeItem = (key: string) => {
    setCart((prev) => prev.filter((x) => x.key !== key));
  };

  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    if (isPlacing) return;
    setIsPlacing(true);
    const orderId = "LM-" + Date.now().toString().slice(-7);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          form: formData,
          items: cart.map((i) => ({
            name: i.name,
            size: i.size,
            qty: i.qty,
            price: i.price,
          })),
          total: totalAmount,
        }),
      });
      if (!res.ok) throw new Error("Order failed");

      setCart([]);
      setIsCheckoutOpen(false);
      setOrderSuccess({ id: orderId });
    } catch {
      alert("Order place nahi ho saka, dobara try karein.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        totalCount,
        openCart: () => setIsCartOpen(true),
        addToCart,
        formatMoney,
      }}
    >
      {children}

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
        formatMoney={formatMoney}
        totalAmount={totalAmount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleCheckoutSubmit}
        isPlacing={isPlacing}
      />

      {orderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-serif italic text-stone-900 mb-2">
              Thank you for your order
            </h2>
            <p className="text-sm text-stone-600 mb-3">
              Order ID: <strong>{orderSuccess.id}</strong>
            </p>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Your order has been placed successfully. We will contact you
              shortly on WhatsApp to confirm it.
            </p>
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-stone-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}
