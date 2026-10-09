export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20 border-b border-stone-200 bg-white/70" />
      <div className="mx-auto grid max-w-6xl animate-pulse gap-8 px-[5%] py-10 md:grid-cols-2 md:gap-14 md:px-[6%]">
        <div className="aspect-4/5 rounded-2xl bg-stone-200/70" />
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white/80 p-8">
          <div className="h-5 w-20 rounded bg-stone-200" />
          <div className="h-10 w-3/4 rounded bg-stone-200" />
          <div className="h-6 w-32 rounded bg-stone-200" />
          <div className="h-20 rounded bg-stone-100" />
          <div className="h-12 rounded-lg bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
