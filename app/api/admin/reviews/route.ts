import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function authorized(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const given = req.headers.get("x-admin-password") ?? "";
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

async function deny() {
  await new Promise((r) => setTimeout(r, 600));
  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function GET(req: Request) {
  if (!authorized(req)) return deny();

  const { data, error } = await supabase
    .from("reviews")
    .select("id,created_at,product_id,name,rating,comment")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  const ids = [...new Set((data ?? []).map((r) => r.product_id))];
  const { data: products } = ids.length
    ? await supabase.from("products").select("id,title").in("id", ids)
    : { data: [] as { id: number; title: string }[] };

  const reviews = (data ?? []).map((r) => ({
    ...r,
    product:
      products?.find((p) => Number(p.id) === r.product_id)?.title ??
      `Product #${r.product_id}`,
  }));

  return NextResponse.json({ ok: true, reviews });
}

export async function DELETE(req: Request) {
  if (!authorized(req)) return deny();

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  return NextResponse.json({ ok: true });
}
