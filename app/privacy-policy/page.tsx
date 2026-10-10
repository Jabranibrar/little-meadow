import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout, { PolicySection } from "../components/PolicyLayout";
import { CONTACT_WHATSAPP, CONTACT_INSTAGRAM } from "../lib/config";

export const metadata: Metadata = {
  title: "Terms & Privacy Policy | Little Meadow",
};

export default function TermsAndPrivacyPage() {
  return (
    <PolicyLayout
      title="Terms & Privacy Policy"
      intro="No complicated jargon. Just simple, honest rules about how we run our boutique and look after your information."
    >
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-10 shadow-2xs">
        <h2 className="text-xs uppercase tracking-wider font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          Everything You Need To Know At A Glance
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
          <div className="flex items-start gap-2">
            <span className="text-stone-400">01.</span>
            <span>
              <strong>Payment:</strong> Cash on Delivery across Pakistan.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400">02.</span>
            <span>
              <strong>Orders:</strong> Confirmed over a quick WhatsApp chat.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400">03.</span>
            <span>
              <strong>Delivery:</strong> Standard 3 to 5 working days.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400">04.</span>
            <span>
              <strong>Exchanges:</strong> Hassle-free size change within 7 days.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400">05.</span>
            <span>
              <strong>Safety:</strong> No bank or card details recorded on site.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400">06.</span>
            <span>
              <strong>Privacy:</strong> We never share or sell your phone
              number.
            </span>
          </div>
        </div>
      </div>

      <PolicySection num="01" title="Shopping & Confirming Orders">
        <p>
          When you place an order on our site, our team will message you on
          WhatsApp to confirm your size and address before dispatching. If an
          outfit is out of stock or details are incomplete, we will inform you
          right away.
        </p>
      </PolicySection>

      <PolicySection num="02" title="Prices & Product Photos">
        <p>
          All prices are in PKR. We photograph our pieces in natural studio
          light to match real fabric colors as closely as possible. Minor color
          variations can sometimes happen depending on your mobile screen
          brightness.
        </p>
      </PolicySection>

      <PolicySection num="03" title="Delivery">
        <p>
          We deliver anywhere in Pakistan within 3 to 5 working days. If you
          need a size swap, let us know within 7 days of receiving your package.
          Check our full{" "}
          <Link
            href="/delivery-info"
            className="underline underline-offset-4 hover:text-stone-900 font-medium"
          >
            Delivery Info
          </Link>{" "}
          for step-by-step guidance.
        </p>
      </PolicySection>

      <PolicySection num="04" title="How We Protect Your Personal Data">
        <p>
          We only ask for your name, phone number, and city to deliver your
          order. Your information is saved securely and passed only to our
          delivery courier. We will never sell or misuse your contact details.
        </p>
      </PolicySection>

      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3 mt-10 shadow-md">
        <h3 className="font-serif italic text-xl sm:text-2xl">
          Questions or need help with sizing?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
          We are a message away. Reach out on WhatsApp or Instagram, and we will
          gladly guide you.
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
