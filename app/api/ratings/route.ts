import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await admin
    .from("reviews")
    .select("product_id,rating")
    .limit(5000);

  if (error) return NextResponse.json({ ratings: {} });

  const sums: Record<string, { total: number; count: number }> = {};
  for (const r of data ?? []) {
    const k = String(r.product_id);
    sums[k] ??= { total: 0, count: 0 };
    sums[k].total += r.rating;
    sums[k].count += 1;
  }

  const ratings: Record<string, { average: number; count: number }> = {};
  for (const [k, v] of Object.entries(sums)) {
    ratings[k] = { average: v.total / v.count, count: v.count };
  }

  return NextResponse.json(
    { ratings },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
