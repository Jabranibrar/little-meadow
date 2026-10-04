"use client";

import React, { useState } from "react";
import { Product } from "../types";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, qty: number) => void;
  formatMoney: (amount: number) => string;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  formatMoney,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("1-2Y");
  const [modalQty, setModalQty] = useState<number>(1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-xl text-stone-400 hover:text-stone-700 bg-transparent border-0 cursor-pointer"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-6">{product.desc}</p>

        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-2">
            Select Size (1-5 Years)
          </label>
          <select
            value={selectedSize}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedSize(e.target.value)
            }
            className="w-full p-3 rounded-lg border border-stone-200 bg-white text-sm font-medium outline-none focus:border-stone-900"
          >
            <option value="1-2Y">1-2 Years</option>
            <option value="2-3Y">2-3 Years</option>
            <option value="3-4Y">3-4 Years</option>
            <option value="4-5Y">4-5 Years</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={modalQty}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setModalQty(parseInt(e.target.value) || 1)
            }
            className="w-full p-3 rounded-lg border border-stone-200 bg-white text-sm font-medium outline-none focus:border-stone-900"
          />
        </div>

        <button
          onClick={() => onAddToCart(product, selectedSize, modalQty)}
          className="w-full bg-stone-900 text-white py-3.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Add to Bag — {formatMoney(product.price * modalQty)}
        </button>
      </div>
    </div>
  );
}
