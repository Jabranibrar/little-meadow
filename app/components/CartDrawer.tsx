"use client";

import React from "react";
import { CartItem } from "../types";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onChangeQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onProceedCheckout: () => void;
  formatMoney: (amount: number) => string;
  totalAmount: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onChangeQty,
  onRemoveItem,
  onProceedCheckout,
  formatMoney,
  totalAmount,
}: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
            <h2 className="text-lg font-bold text-stone-900">
              Your Shopping Bag
            </h2>
            <button
              onClick={onClose}
              className="text-xl text-stone-400 hover:text-stone-700 border-0 bg-transparent cursor-pointer"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center text-center py-24">
              <p className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-6">
                Your bag is empty
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document
                      .getElementById("shop")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="bg-stone-900 text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b border-stone-100 pb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 shrink-0 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] uppercase font-semibold">
                          Img
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">
                        {item.name}
                      </h4>
                      <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        Size: {item.size}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onChangeQty(item.key, -1)}
                          className="w-6 h-6 rounded border border-stone-200 flex items-center justify-center bg-white text-xs font-bold cursor-pointer hover:bg-stone-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onChangeQty(item.key, 1)}
                          className="w-6 h-6 rounded border border-stone-200 flex items-center justify-center bg-white text-xs font-bold cursor-pointer hover:bg-stone-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900 text-sm">
                      {formatMoney(item.price * item.qty)}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.key)}
                      className="text-[11px] text-red-500 font-medium mt-1 bg-transparent border-0 cursor-pointer hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-stone-100 pt-4 mt-4">
            <div className="flex justify-between text-base font-bold text-stone-900 mb-4">
              <span>Subtotal</span>
              <span>{formatMoney(totalAmount)}</span>
            </div>
            <button
              onClick={onProceedCheckout}
              className="w-full bg-stone-900 text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
