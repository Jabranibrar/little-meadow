"use client";

import { useState } from "react";
import Link from "next/link";

interface AdminReview {
  id: number;
  created_at: string;
  product: string;
  name: string;
  rating: number;
  comment: string;
}

export default function AdminReviewsPage() {
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401) {
        setError("Wrong password.");
        return;
      }
      const out = await res.json();
      if (!res.ok || !out.ok) throw new Error("failed");
      setReviews(out.reviews);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this review permanently?")) return;
    const res = await fetch(`/api/admin/reviews?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setReviews((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } else {
      alert("Could not delete. Try again.");
    }
  };

  return (
    <main className="min-h-screen px-[5%] py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-2xs sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-serif text-2xl italic text-stone-900 sm:text-3xl">
            Manage Reviews
          </h1>
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-stone-600 underline underline-offset-4 hover:text-stone-900"
          >
            Back to store
          </Link>
        </div>

        {reviews === null ? (
          <form onSubmit={load} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none focus:border-stone-900"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-stone-900 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 disabled:opacity-70 cursor-pointer"
            >
              {busy ? "Checking..." : "Unlock"}
            </button>
          </form>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-stone-500">No reviews yet.</p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {reviews.map((r) => (
              <li key={r.id} className="flex gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {r.product}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {r.name}{" "}
                    <span className="text-amber-500">
                      {"★".repeat(r.rating)}
                    </span>
                    <span className="text-stone-300">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-line wrap-break-word text-sm text-stone-700">
                    {r.comment}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-400">
                    {new Date(r.created_at).toLocaleString("en-GB")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="h-fit shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
