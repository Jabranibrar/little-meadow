import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

type Item = { name: string; size: string; qty: number; price: number };

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const { orderId, form, items, total } = await req.json();

  if (!orderId || !form?.name || !form?.phone || !items?.length) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

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

  const digits = String(form.phone).replace(/\D/g, "");
  const intl = digits.startsWith("92")
    ? digits
    : "92" + digits.replace(/^0/, "");

  const confirmMsg = `Assalam o Alaikum ${
    form.name
  }! Aap ka Little Meadow ka order (${orderId}) confirm ho gaya hai. Total: PKR ${Number(
    total
  ).toLocaleString("en-PK")}. Jald delivery ho gi. Shukriya!`;
  const waLink = `https://wa.me/${intl}?text=${encodeURIComponent(confirmMsg)}`;

  const rows = (items as Item[])
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
