import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white/80 px-6 py-12 text-center shadow-sm backdrop-blur-sm sm:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
          Error 404
        </p>
        <h1 className="mt-4 font-serif text-4xl italic text-stone-900 sm:text-5xl">
          Page not found
        </h1>
        <div className="mx-auto my-6 h-px w-12 bg-stone-400" />
        <p className="text-sm leading-relaxed text-stone-600">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <Link
          href="/#shop"
          className="mt-8 inline-block rounded-lg bg-stone-900 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-stone-800"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
