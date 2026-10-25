"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Product } from "../types";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  formatMoney: (amount: number) => string;
  onSelectProduct: (product: Product) => void;
}

const norm = (s: string) => s.toLowerCase().trim();

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded-sm bg-pink-100 px-0.5 text-stone-900"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function SearchModal({
  isOpen,
  onClose,
  products,
  formatMoney,
  onSelectProduct,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(
    () => norm(query).split(/\s+/).filter(Boolean),
    [query]
  );

  const results = useMemo(() => {
    if (tokens.length === 0) return [];
    return products
      .filter((p) => {
        const hay = norm(
          [
            p.name,
            p.category,
            p.description,
            p.fabric,
            p.occasion,
            ...p.colors.map((c) => c.name),
          ].join(" ")
        );
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 20);
  }, [products, tokens]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category))].filter(
        (c) => c !== "unisex"
      ),
    [products]
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
    const resetTimer = setTimeout(() => setQuery(""), 150);
    return () => clearTimeout(resetTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!isOpen) return null;

  const choose = (p: Product) => {
    onSelectProduct(p);
    onClose();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active] ?? results[0]);
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-80 flex items-start justify-center bg-black/50 px-3 pt-12 backdrop-blur-sm sm:px-4 sm:pt-20"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        onClick={(e) => e.stopPropagation()}
        className="animate-pop flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Input */}
        <div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-stone-100 bg-white p-3.5 sm:gap-3 sm:p-5">
          <svg
            className="h-5 w-5 shrink-0 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search dresses, colours, categories..."
            className="w-full bg-transparent text-sm font-medium text-stone-900 outline-none placeholder:text-stone-400 sm:text-base"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="shrink-0 cursor-pointer rounded-md bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-900 sm:text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-800"
          >
            ×
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-5">
          {tokens.length === 0 ? (
            <div className="px-2 py-8 text-center sm:py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                Popular searches
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setQuery(c);
                      setActive(0);
                      inputRef.current?.focus();
                    }}
                    className="cursor-pointer rounded-full border border-stone-200 bg-[#faf8f5] px-4 py-2 text-xs font-semibold capitalize text-stone-700 transition-all hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-stone-500 sm:py-14 sm:text-sm">
              No matching pieces found for{" "}
              <span className="font-semibold text-stone-800">
                &ldquo;{query}&rdquo;
              </span>
              .
              <p className="mt-2 text-[11px] text-stone-400">
                Try a shorter word or a category like frocks.
              </p>
            </div>
          ) : (
            <>
              <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <div className="divide-y divide-stone-100" role="listbox">
                {results.map((p, i) => {
                  const soldOut =
                    (p.stock !== null && p.stock <= 0) ||
                    p.availableSizes.length === 0;
                  const on = i === active;
                  return (
                    <div
                      key={p.id}
                      role="option"
                      aria-selected={on}
                      data-active={on}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(p)}
                      className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2.5 py-2.5 transition-colors sm:px-3 sm:py-3 ${
                        on ? "bg-[#faf8f5]" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 sm:h-14 sm:w-14">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="56px"
                              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                                soldOut ? "opacity-60 grayscale-20" : ""
                              }`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                              Img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-xs font-semibold text-stone-900 sm:text-sm">
                            <Highlight text={p.name} tokens={tokens} />
                          </h4>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-stone-500 sm:text-[10px]">
                              {p.category}
                            </span>
                            {soldOut && (
                              <span className="inline-block rounded-full bg-stone-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                Sold out
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5 text-right sm:gap-3">
                        <span className="block text-xs font-bold text-stone-900 sm:text-sm">
                          {formatMoney(p.price)}
                        </span>
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all sm:h-8 sm:w-8 ${
                            on
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          <svg
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="hidden items-center justify-center gap-4 border-t border-stone-100 bg-stone-50 px-6 py-3 text-[11px] text-stone-500 sm:flex">
          <span>
            <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono shadow-2xs">
              ↑
            </kbd>{" "}
            <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono shadow-2xs">
              ↓
            </kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono shadow-2xs">
              Enter
            </kbd>{" "}
            open
          </span>
          <span>
            <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono shadow-2xs">
              Esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
