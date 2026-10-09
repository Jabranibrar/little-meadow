"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem, CheckoutFormData } from "../types";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import { calcDelivery } from "../lib/config";
import { trackPurchase } from "../lib/analytics";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [hydrated, setHydrated] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("lm-cart");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCart(
              parsed.filter(
                (x): x is CartItem =>
                  x &&
                  typeof x.key === "string" &&
                  typeof x.id === "number" &&
                  typeof x.price === "number" &&
                  typeof x.qty === "number" &&
                  x.qty > 0
              )
            );
          }
        }
      } catch {}
      setHydrated(true);
    }, 0);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("lm-cart", JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  useEffect(() => {
    const locked = isCartOpen || isCheckoutOpen || !!orderSuccess;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isCheckoutOpen, orderSuccess]);

  const formatMoney = (n: number): string => "PKR " + n.toLocaleString("en-PK");

  const addToCart = (product: Product, size: string, qty: number) => {
    const currentStock =
      product.stock !== null && product.stock !== undefined
        ? product.stock
        : 999;
    const key = product.id + "-" + size;

    setCart((prev) => {
      const found = prev.find((x) => x.key === key);
      const existingQty = found ? found.qty : 0;

      if (existingQty + qty > currentStock) {
        showToast(
          `Only ${currentStock} items left in stock for "${product.name}".`
        );
        return prev;
      }

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
          stock: product.stock,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const changeQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((x) => {
          if (x.key === key) {
            const newQty = x.qty + delta;
            const maxStock =
              x.stock !== null && x.stock !== undefined ? x.stock : 999;

            if (delta > 0 && newQty > maxStock) {
              showToast(
                `Maximum available stock reached (${maxStock} items) for "${x.name}".`
              );
              return x;
            }

            if (newQty <= 0) return x;
            return { ...x, qty: newQty };
          }
          return x;
        })
        .filter((x) => x.qty > 0)
    );
  };

  const removeItem = (key: string) => {
    setCart((prev) => prev.filter((x) => x.key !== key));
  };

  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);

  const deliveryFee = calcDelivery(totalAmount);

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
          items: cart.map((i) => ({ id: i.id, size: i.size, qty: i.qty })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.reason === "stock") {
          showToast(
            `Item "${data.product}" is currently out of stock or limited.`
          );
          return;
        }
        throw new Error("Order failed");
      }

      trackPurchase(totalAmount + deliveryFee, orderId);

      setCart([]);
      setIsCheckoutOpen(false);
      setOrderSuccess({ id: orderId });
    } catch {
      showToast("Unable to place order. Please try again.");
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

      {toastMessage && (
        <div className="fixed top-6 right-6 z-9999 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-fade-in transition-all">
          <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            {toastMessage}
          </span>
        </div>
      )}

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
        deliveryFee={deliveryFee}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleCheckoutSubmit}
        isPlacing={isPlacing}
      />

      {orderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
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
              onClick={() => {
                setOrderSuccess(null);
                router.push("/#shop");
              }}
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
