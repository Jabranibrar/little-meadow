import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 3) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function GET(req: Request) {
  const productId = Number(new URL(req.url).searchParams.get("productId"));
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id,created_at,name,rating,comment")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const reviews = data ?? [];
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return NextResponse.json({ reviews, count, average, distribution });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  // bot trap
  if (body.website) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, reason: "limit" }, { status: 429 });
  }

  const productId = Number(body.productId);
  const rating = Number(body.rating);
  const name = String(body.name ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const comment = String(body.comment ?? "").trim();

  if (
    !Number.isInteger(productId) ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    name.length < 2 ||
    name.length > 40 ||
    comment.length < 5 ||
    comment.length > 600
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();
  if (!product) return NextResponse.json({ ok: false }, { status: 404 });

  const { data, error } = await supabase
    .from("reviews")
    .insert({ product_id: productId, name, rating, comment })
    .select("id,created_at,name,rating,comment")
    .single();

  if (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, review: data });
}
