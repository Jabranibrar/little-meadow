"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Review {
  id: number;
  created_at: string;
  edited_at?: string | null;
  name: string;
  rating: number;
  comment: string;
}

type Sort = "newest" | "highest" | "lowest";

const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];
const AVATARS = [
  "bg-pink-100",
  "bg-amber-100",
  "bg-emerald-100",
  "bg-sky-100",
  "bg-violet-100",
];
const TOKEN_KEY = "lm_review_tokens";

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

function readTokens(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

function saveToken(id: number, token: string) {
  try {
    const t = readTokens();
    t[id] = token;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
  } catch {}
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function SortMenu({
  value,
  onChange,
}: {
  value: Sort;
  onChange: (v: Sort) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current =
    SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-xs font-semibold text-stone-800 shadow-2xs transition-all hover:border-stone-900 cursor-pointer"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Sort
        </span>
        {current.label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 text-stone-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Sort reviews"
          className="animate-pop absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white p-1 shadow-xl"
        >
          {SORT_OPTIONS.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#faf8f5] font-bold text-stone-900"
                      : "font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {o.label}
                  {selected && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden
                    >
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <span className="flex text-stone-300">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={`${size} shrink-0`} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-500"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={`${size} shrink-0`} />
        ))}
      </span>
    </span>
  );
}

const field =
  "w-full rounded-lg border border-stone-200 bg-white p-3 text-sm outline-none transition-colors focus:border-stone-900";

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(5);
  const [sort, setSort] = useState<Sort>("newest");
  const [filter, setFilter] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [hp, setHp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.reviews)) setReviews(d.reviews);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [productId]);

  const stats = useMemo(() => {
    const count = reviews.length;
    const average = count
      ? reviews.reduce((s, r) => s + r.rating, 0) / count
      : 0;
    const distribution = [5, 4, 3, 2, 1].map(
      (st) => reviews.filter((r) => r.rating === st).length
    );
    return { count, average, distribution };
  }, [reviews]);

  const list = useMemo(() => {
    const base = filter ? reviews.filter((r) => r.rating === filter) : reviews;
    const sorted = [...base];
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating);
    return sorted;
  }, [reviews, sort, filter]);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setRating(0);
    setHover(0);
    setName("");
    setComment("");
    setError("");
  };

  const openNew = (stars = 0) => {
    setEditingId(null);
    setRating(stars);
    setName("");
    setComment("");
    setError("");
    setNotice("");
    setFormOpen(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      60
    );
  };

  const openEdit = (r: Review) => {
    setEditingId(r.id);
    setRating(r.rating);
    setName(r.name === "Anonymous" ? "" : r.name);
    setComment(r.comment);
    setError("");
    setNotice("");
    setFormOpen(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      60
    );
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (rating === 0) {
      setError("Please tap a star to rate.");
      return;
    }
    setSending(true);
    setError("");

    try {
      if (editingId !== null) {
        const token = readTokens()[editingId];
        const res = await fetch("/api/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, token, rating, name, comment }),
        });
        const out = await res.json().catch(() => null);
        if (res.status === 429) {
          setError("Too many changes. Please try again in a few minutes.");
          return;
        }
        if (!res.ok || !out?.ok) throw new Error("failed");
        setReviews((prev) =>
          prev.map((r) => (r.id === editingId ? (out.review as Review) : r))
        );
        setNotice("Your review has been updated.");
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            rating,
            name,
            comment,
            website: hp,
          }),
        });
        const out = await res.json().catch(() => null);
        if (res.status === 429) {
          setError("Too many reviews from your connection. Please try later.");
          return;
        }
        if (!res.ok || !out?.ok) throw new Error("failed");
        if (out.review) {
          if (out.token) saveToken(out.review.id, out.token);
          setReviews((prev) => [out.review as Review, ...prev]);
        }
        setNotice("Thank you! Your review has been posted.");
      }
      resetForm();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const active = hover || rating;
  const tokens = readTokens();
  const avgLabel = stats.count ? LABELS[Math.round(stats.average) - 1] : "";

  return (
    <section
      id="reviews"
      className="mt-6 sm:mt-8 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-xs shadow-2xs p-5 sm:p-8 md:p-10"
    >
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-stone-500 mb-2">
          Customer Love
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-stone-900">
          Ratings &amp; Reviews
        </h2>
        <div className="w-12 h-px bg-stone-400 mx-auto mt-5" />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-28 rounded-xl bg-stone-100" />
          <div className="h-16 rounded-xl bg-stone-100" />
        </div>
      ) : (
        <>
          {/* Summary */}
          {stats.count > 0 ? (
            <div className="grid gap-6 md:grid-cols-[230px_1fr] md:gap-10 items-center rounded-xl border border-stone-200 bg-[#faf8f5] p-5 sm:p-6">
              <div className="text-center">
                <p className="font-serif text-5xl sm:text-6xl text-stone-900 leading-none">
                  {stats.average.toFixed(1)}
                </p>
                <div className="mt-3 flex justify-center">
                  <Stars value={stats.average} size="h-5 w-5" />
                </div>
                <p className="mt-2 text-sm font-semibold text-stone-800">
                  {avgLabel}
                </p>
                <p className="text-xs text-stone-500">
                  {stats.count} {stats.count === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const n = stats.distribution[i];
                  const pct = stats.count ? (n / stats.count) * 100 : 0;
                  const on = filter === star;
                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={n === 0}
                      onClick={() => {
                        setFilter(on ? 0 : star);
                        setVisible(5);
                      }}
                      className={`flex w-full items-center gap-3 rounded-md px-2 py-1 text-xs transition-colors ${
                        on ? "bg-white shadow-2xs" : "hover:bg-white/70"
                      } ${
                        n === 0 ? "cursor-default opacity-50" : "cursor-pointer"
                      }`}
                    >
                      <span className="w-8 shrink-0 text-left font-semibold text-stone-600">
                        {star} ★
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                        <span
                          className="bar-grow block h-full rounded-full bg-linear-to-r from-amber-400 to-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-6 shrink-0 text-right text-stone-500">
                        {n}
                      </span>
                    </button>
                  );
                })}
                {filter !== 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter(0)}
                    className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500 underline underline-offset-4 hover:text-stone-900 cursor-pointer"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-stone-500">
              No reviews yet. Be the first to share your experience.
            </p>
          )}

          {/* Notice */}
          {notice && (
            <p className="mx-auto mt-5 max-w-xl rounded-lg bg-emerald-50 px-4 py-2.5 text-center text-sm font-medium text-emerald-700">
              {notice}
            </p>
          )}

          {/* Quick rate */}
          {!formOpen && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Tap a star to rate this piece
              </p>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => openNew(n)}
                    className={`cursor-pointer transition-all hover:scale-125 ${
                      n <= hover ? "text-amber-500" : "text-stone-300"
                    }`}
                  >
                    <StarIcon className="h-8 w-8 sm:h-9 sm:w-9" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openNew(0)}
                className="rounded-xl border border-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-900 transition-colors hover:bg-stone-900 hover:text-white cursor-pointer"
              >
                Write a review
              </button>
            </div>
          )}

          {/* Form */}
          {formOpen && (
            <form
              ref={formRef}
              onSubmit={submit}
              className="mx-auto mt-6 max-w-xl space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-2xs sm:p-6"
            >
              <p className="font-serif text-xl italic text-stone-900">
                {editingId !== null
                  ? "Edit your review"
                  : "Share your experience"}
              </p>

              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Your rating
                </p>
                <div
                  className="flex flex-wrap items-center gap-1"
                  onMouseLeave={() => setHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setRating(n)}
                      className={`cursor-pointer transition-all hover:scale-110 ${
                        n <= active ? "text-amber-500" : "text-stone-300"
                      }`}
                    >
                      <StarIcon className="h-9 w-9" />
                    </button>
                  ))}
                  {active > 0 && (
                    <span className="ml-2 text-sm font-semibold text-stone-700">
                      {LABELS[active - 1]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Your name{" "}
                  <span className="font-medium normal-case tracking-normal text-stone-400">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. Ayesha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Your review{" "}
                  <span className="font-medium normal-case tracking-normal text-stone-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={4}
                  maxLength={600}
                  placeholder="How was the fabric, fit and quality?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`${field} resize-none`}
                />
                <p className="mt-1 text-right text-[11px] text-stone-400">
                  {comment.length}/600
                </p>
              </div>

              {/* bot trap */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={sending}
                  className="flex-1 rounded-lg border border-stone-300 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors hover:bg-stone-50 cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-stone-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-stone-800 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
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
                      Saving...
                    </>
                  ) : editingId !== null ? (
                    "Save changes"
                  ) : (
                    "Post review"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sort */}
          {reviews.length > 1 && (
            <div className="mt-8 flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {list.length} {list.length === 1 ? "review" : "reviews"}
                {filter ? ` · ${filter} star` : ""}
              </p>
              <SortMenu value={sort} onChange={setSort} />
            </div>
          )}

          {/* List */}
          {list.length > 0 && (
            <ul className="divide-y divide-stone-200">
              {list.slice(0, visible).map((r) => {
                const mine = Boolean(tokens[r.id]);
                return (
                  <li key={r.id} className="flex gap-3 py-5 sm:gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg text-stone-800 ${
                        AVATARS[r.name.length % AVATARS.length]
                      }`}
                    >
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                          {r.name}
                          {mine && (
                            <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {fmtDate(r.created_at)}
                          {r.edited_at ? " · Edited" : ""}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars value={r.rating} />
                        <span className="text-[11px] font-semibold text-stone-500">
                          {LABELS[r.rating - 1]}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-stone-700">
                          {r.comment}
                        </p>
                      )}
                      {mine && (
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="mt-2 text-[11px] font-bold uppercase tracking-wider text-stone-500 underline underline-offset-4 hover:text-stone-900 cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {list.length > visible && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 5)}
                className="text-xs font-bold uppercase tracking-wider text-stone-600 underline underline-offset-4 hover:text-stone-900 cursor-pointer"
              >
                Show more reviews
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
