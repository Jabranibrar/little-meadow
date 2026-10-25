"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  created_at: string;
  name: string;
  rating: number;
  comment: string;
}

interface ReviewData {
  reviews: Review[];
  count: number;
  average: number;
  distribution: number[];
}

const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

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
  "w-full rounded-lg border border-stone-200 bg-white p-3 text-sm outline-none focus:border-stone-900";

export default function ProductReviews({ productId }: { productId: number }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [hp, setHp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.reviews) setData(d);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [productId]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          rating,
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
        setData((prev) => {
          const reviews = [out.review as Review, ...(prev?.reviews ?? [])];
          const count = reviews.length;
          return {
            reviews,
            count,
            average: reviews.reduce((s, r) => s + r.rating, 0) / count,
            distribution: [5, 4, 3, 2, 1].map(
              (st) => reviews.filter((r) => r.rating === st).length
            ),
          };
        });
      }
      setDone(true);
      setFormOpen(false);
      setComment("");
      setRating(0);
    } catch {
      setError("Could not post your review. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const count = data?.count ?? 0;
  const shown = data?.reviews.slice(0, visible) ?? [];
  const active = hover || rating;

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
          <div className="h-24 rounded-xl bg-stone-100" />
          <div className="h-16 rounded-xl bg-stone-100" />
        </div>
      ) : (
        <>
          {count > 0 && data ? (
            <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-10 items-center rounded-xl border border-stone-200 bg-[#faf8f5] p-5 sm:p-6">
              <div className="text-center">
                <p className="font-serif text-5xl sm:text-6xl text-stone-900 leading-none">
                  {data.average.toFixed(1)}
                </p>
                <div className="mt-3 flex justify-center">
                  <Stars value={data.average} size="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs text-stone-500">
                  Based on {count} {count === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const n = data.distribution[i];
                  const pct = count ? (n / count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-8 shrink-0 font-semibold text-stone-600">
                        {star} ★
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                        <span
                          className="block h-full rounded-full bg-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-6 shrink-0 text-right text-stone-500">
                        {n}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-stone-500">
              No reviews yet. Be the first to share your experience.
            </p>
          )}

          {/* Write a review */}
          <div className="mt-6 text-center">
            {done && (
              <p className="mb-3 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                Thank you! Your review has been posted.
              </p>
            )}
            {!formOpen && (
              <button
                type="button"
                onClick={() => {
                  setFormOpen(true);
                  setDone(false);
                }}
                className="rounded-xl border border-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-900 transition-colors hover:bg-stone-900 hover:text-white cursor-pointer"
              >
                Write a review
              </button>
            )}
          </div>

          {formOpen && (
            <form
              onSubmit={submit}
              className="mx-auto mt-5 max-w-xl space-y-4 rounded-xl border border-stone-200 bg-white p-5 sm:p-6"
            >
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Your rating *
                </p>
                <div
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setRating(n)}
                      className={`cursor-pointer transition-transform hover:scale-110 ${
                        n <= active ? "text-amber-500" : "text-stone-300"
                      }`}
                    >
                      <StarIcon className="h-8 w-8" />
                    </button>
                  ))}
                  {active > 0 && (
                    <span className="ml-2 text-xs font-semibold text-stone-600">
                      {LABELS[active - 1]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Your name *
                </label>
                <input
                  required
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
                  Your review *
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={5}
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
                className="absolute -left-2499.75 h-0 w-0 opacity-0"
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
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
                      Posting...
                    </>
                  ) : (
                    "Post review"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* List */}
          {shown.length > 0 && (
            <ul className="mt-8 divide-y divide-stone-200">
              {shown.map((r) => (
                <li key={r.id} className="flex gap-3 sm:gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 font-serif text-lg text-stone-800">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {new Date(r.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="mt-1">
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-stone-700">
                      {r.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {data && data.reviews.length > visible && (
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
