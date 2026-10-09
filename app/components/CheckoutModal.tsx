"use client";

import React, { useState } from "react";
import { CheckoutFormData } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (formData: CheckoutFormData) => void;
  isPlacing?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmitOrder,
  isPlacing = false,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    payment: "Cash on Delivery",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitOrder(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-stone-900">Secure Checkout</h2>
          <button
            onClick={onClose}
            disabled={isPlacing}
            aria-label="Close"
            className="text-xl text-stone-400 hover:text-stone-700 bg-transparent border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
          Enter your delivery details below to place your order. We will confirm
          it with you on WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset
            disabled={isPlacing}
            className="space-y-4 border-0 p-0 m-0 min-w-0"
          >
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ali Ahmed"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                WhatsApp Phone *
              </label>
              <input
                required
                type="tel"
                inputMode="numeric"
                maxLength={13}
                pattern="(\+?92|0)?3[0-9]{9}"
                title="Enter a valid mobile number, e.g. 03001234567"
                placeholder="03001234567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Lahore / Gujrat"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Delivery Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="House no, street, area..."
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-stone-200 text-sm outline-none focus:border-stone-900 resize-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <div className="w-full p-3 rounded-lg border border-stone-200 bg-stone-50 text-sm font-medium text-stone-700">
                Cash on Delivery
              </div>
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={isPlacing}
            className="w-full bg-stone-900 text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-stone-800 transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPlacing ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
