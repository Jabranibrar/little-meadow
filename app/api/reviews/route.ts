import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COLS = "id,created_at,edited_at,name,rating,comment";

const hits = new Map<string, number[]>();
function limited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

function clean(body: Record<string, unknown>) {
  const rating = Number(body.rating);
  const name =
    String(body.name ?? "")
      .trim()
      .replace(/\s+/g, " ") || "Anonymous";
  const comment = String(body.comment ?? "").trim();
  const ok =
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5 &&
    name.length <= 40 &&
    comment.length <= 600;
  return { ok, rating, name, comment };
}

const ipOf = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

export async function GET(req: Request) {
  const productId = Number(new URL(req.url).searchParams.get("productId"));
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(COLS)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reviews: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  // bot trap
  if (body.website) return NextResponse.json({ ok: true });

  if (limited("post:" + ipOf(req), 3)) {
    return NextResponse.json({ ok: false, reason: "limit" }, { status: 429 });
  }

  const productId = Number(body.productId);
  const c = clean(body);
  if (!Number.isInteger(productId) || !c.ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();
  if (!product) return NextResponse.json({ ok: false }, { status: 404 });

  const token = randomBytes(16).toString("hex");

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      name: c.name,
      rating: c.rating,
      comment: c.comment,
      edit_token: sha(token),
    })
    .select(COLS)
    .single();

  if (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, review: data, token });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  if (limited("put:" + ipOf(req), 10)) {
    return NextResponse.json({ ok: false, reason: "limit" }, { status: 429 });
  }

  const id = Number(body.id);
  const token = String(body.token ?? "");
  const c = clean(body);
  if (!Number.isInteger(id) || !token || !c.ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data: row } = await supabase
    .from("reviews")
    .select("edit_token")
    .eq("id", id)
    .maybeSingle();

  if (!row?.edit_token) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const a = Buffer.from(sha(token));
  const b = Buffer.from(String(row.edit_token));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({
      name: c.name,
      rating: c.rating,
      comment: c.comment,
      edited_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(COLS)
    .single();

  if (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, review: data });
}
