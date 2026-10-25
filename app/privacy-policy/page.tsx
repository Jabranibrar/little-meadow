import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout, { PolicySection } from "../components/PolicyLayout";
import { CONTACT_WHATSAPP, CONTACT_INSTAGRAM } from "../lib/config";

export const metadata: Metadata = {
  title: "Terms & Privacy Policy",
};

const glance = [
  { k: "Orders", v: "Confirmed with you on WhatsApp." },
  { k: "Payment", v: "Cash on Delivery only, for now." },
  { k: "Prices", v: "Shown in PKR, final at checkout." },
  { k: "Your data", v: "Name, phone and address only." },
  { k: "Cards & banks", v: "We never collect these." },
  { k: "Privacy", v: "We never sell or share your details." },
];

export default function TermsAndPrivacyPage() {
  return (
    <PolicyLayout
      title="Terms & Privacy Policy"
      intro="Simple, honest rules for shopping with us and how we look after your information."
    >
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-10 shadow-2xs">
        <h2 className="text-xs uppercase tracking-wider font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          At A Glance
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
          {glance.map((g, i) => (
            <div key={g.k} className="flex items-start gap-2">
              <span className="text-stone-400">0{i + 1}.</span>
              <span>
                <strong>{g.k}:</strong> {g.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PolicySection num="01" title="Orders">
        <p>
          An order is confirmed once you reply to our WhatsApp message. If an
          item is out of stock or your details are incomplete, we will let you
          know right away.
        </p>
      </PolicySection>

      <PolicySection num="02" title="Prices & Photos">
        <p>
          Prices are in PKR. We try to show true fabric colours, but they may
          look slightly different on your screen.
        </p>
      </PolicySection>

      <PolicySection num="03" title="Your Information">
        <p>
          We ask only for your name, phone number, address and email to deliver
          your order. Your details are shared only with our courier and are
          never sold. We do not store card or bank details.
        </p>
        <p>You can ask us to correct or delete your information at any time.</p>
      </PolicySection>

      <PolicySection num="04" title="Delivery">
        <p>
          See our{" "}
          <Link
            href="/delivery-info"
            className="underline underline-offset-4 hover:text-stone-900 font-medium"
          >
            Delivery Info
          </Link>{" "}
          for delivery time and charges. It is part of these terms.
        </p>
      </PolicySection>

      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3 mt-10 shadow-md">
        <h3 className="font-serif italic text-xl sm:text-2xl">
          Questions or need help with sizing?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
          Message us on WhatsApp or Instagram and we will gladly help.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold">
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP?.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-stone-900 px-5 py-2.5 rounded-full uppercase tracking-wider hover:bg-stone-100 transition-colors"
          >
            WhatsApp: {CONTACT_WHATSAPP}
          </a>
          {CONTACT_INSTAGRAM && (
            <a
              href={`https://instagram.com/${CONTACT_INSTAGRAM.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-stone-700 text-stone-200 px-5 py-2.5 rounded-full uppercase tracking-wider hover:border-white transition-colors"
            >
              Instagram: {CONTACT_INSTAGRAM}
            </a>
          )}
        </div>
      </div>
    </PolicyLayout>
  );
}
