export function ProductSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-stone-200 bg-white"
        >
          <div className="aspect-4/5 bg-stone-200/70" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-16 rounded bg-stone-200" />
            <div className="h-4 w-3/4 rounded bg-stone-200" />
            <div className="h-3 w-full rounded bg-stone-100" />
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="h-7 rounded bg-stone-100" />
              ))}
            </div>
            <div className="h-10 rounded-lg bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
