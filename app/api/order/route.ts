import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calcDelivery } from "../../lib/config";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

type Item = { name: string; size: string; qty: number; price: number };
type RawItem = { id: number; size: string; qty: number };

const SIZES = ["1-2Y", "2-3Y", "3-4Y", "4-5Y"];

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const { orderId, form, items: rawItems } = await req.json();

  const phoneOk = /^(\+?92|0)?3\d{9}$/.test(
    String(form?.phone ?? "").replace(/[\s-]/g, "")
  );

  if (
    !orderId ||
    !form?.name ||
    !form?.address ||
    !phoneOk ||
    !Array.isArray(rawItems) ||
    rawItems.length === 0 ||
    rawItems.length > 30
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const valid = (rawItems as RawItem[]).every(
    (i) =>
      Number.isInteger(i.id) &&
      SIZES.includes(i.size) &&
      Number.isInteger(i.qty) &&
      i.qty >= 1 &&
      i.qty <= 20
  );
  if (!valid) return NextResponse.json({ ok: false }, { status: 400 });

  const ids = [...new Set((rawItems as RawItem[]).map((i) => i.id))];
  const { data: dbProducts, error: pErr } = await supabase
    .from("products")
    .select("id,title,price,stock")
    .in("id", ids);

  if (pErr) console.error("Products fetch error:", pErr);
  if (pErr || !dbProducts || dbProducts.length !== ids.length) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const wantedQty = (id: number) =>
    (rawItems as RawItem[])
      .filter((i) => i.id === id)
      .reduce((s, i) => s + i.qty, 0);

  for (const id of ids) {
    const p = dbProducts.find((d) => Number(d.id) === id)!;
    if (typeof p.stock === "number" && p.stock < wantedQty(id)) {
      return NextResponse.json(
        { ok: false, reason: "stock", product: p.title },
        { status: 409 }
      );
    }
  }

  const items: Item[] = (rawItems as RawItem[]).map((i) => {
    const p = dbProducts.find((d) => Number(d.id) === i.id)!;
    return {
      name: p.title || "Product",
      size: i.size,
      qty: i.qty,
      price: Number(p.price),
    };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = calcDelivery(subtotal);
  const total = subtotal + delivery;

  const { error } = await supabase.from("orders").insert({
    order_id: orderId,
    name: form.name,
    phone: form.phone,
    email: form.email,
    city: form.city,
    address: form.address,
    payment: form.payment,
    items,
    total,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  for (const id of ids) {
    const p = dbProducts.find((d) => Number(d.id) === id)!;
    if (typeof p.stock !== "number") continue;
    await supabase
      .from("products")
      .update({ stock: p.stock - wantedQty(id) })
      .eq("id", id);
  }

  const digits = String(form.phone).replace(/\D/g, "");
  const intl = digits.startsWith("92")
    ? digits
    : "92" + digits.replace(/^0/, "");

  const itemLines = items
    .map((i) => `- ${i.name} (Size: ${i.size}) x ${i.qty}`)
    .join("\n");

  const confirmMsg = `Hello ${
    form.name
  }, thank you for ordering from *Little Meadow*.

*Order #:* ${orderId}
${itemLines}
*Total:* Rs. ${total.toLocaleString("en-PK")}
*Deliver to:* ${form.address}, ${form.city}

Please reply *CONFIRM* to confirm your order and we will dispatch it shortly.

*Team Little Meadow*`;

  const waLink = `https://wa.me/${intl}?text=${encodeURIComponent(confirmMsg)}`;

  const rows = items
    .map(
      (i) =>
        `<li>${esc(i.name)} (${esc(i.size)}) x ${i.qty} = PKR ${
          i.price * i.qty
        }</li>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: "Little Meadow <onboarding@resend.dev>",
      to: process.env.OWNER_EMAIL!,
      subject: `New Order ${orderId} - PKR ${total}`,
      html: `
        <h2>New Order ${esc(orderId)}</h2>
        <p>
          <b>Name:</b> ${esc(form.name)}<br/>
          <b>Phone:</b> ${esc(form.phone)}<br/>
          <b>City:</b> ${esc(form.city)}<br/>
          <b>Address:</b> ${esc(form.address)}<br/>
          <b>Payment:</b> ${esc(form.payment)}
        </p>
        <ul>${rows}</ul>
        <p>Delivery: PKR ${delivery}</p>
        <p><b>Total: PKR ${total}</b></p>
        <p>
          <a href="${waLink}" style="background:#25D366;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">
            Send confirmation on WhatsApp
          </a>
        </p>
      `,
    });
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ ok: true });
}
