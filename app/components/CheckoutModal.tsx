"use client";

import React, { useState } from "react";
import { CheckoutFormData } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (formData: CheckoutFormData) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmitOrder,
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
            className="text-xl text-stone-400 hover:text-stone-700 bg-transparent border-0 cursor-pointer"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Enter your shipping details below to complete your order instantly via
          WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              type="text"
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
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              value={formData.payment}
              onChange={(e) =>
                setFormData({ ...formData, payment: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-stone-200 bg-white text-sm outline-none focus:border-stone-900 font-medium"
            >
              <option>Cash on Delivery</option>
              <option>Direct Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer mt-2"
          >
            Confirm Order via WhatsApp 💬
          </button>
        </form>
      </div>
    </div>
  );
}
