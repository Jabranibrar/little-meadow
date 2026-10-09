import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout, {
  PolicySection,
  PolicyList,
} from "../components/PolicyLayout";
import { CONTACT_WHATSAPP, CONTACT_INSTAGRAM } from "../lib/config";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      intro="By using this website and placing an order with Little Meadow by Ayra & Hadin, you agree to the terms below. Please read them carefully."
    >
      <PolicySection num="01" title="Using Our Website">
        <p>
          You agree to use this website lawfully and to give accurate
          information when ordering. All content on this website, including
          text, images and branding, belongs to Little Meadow and may not be
          copied or reused without permission.
        </p>
      </PolicySection>

      <PolicySection num="02" title="Orders & Confirmation">
        <p>
          Placing an order is a request to buy. An order is confirmed only after
          we contact you on WhatsApp and you reply to confirm. We may decline or
          cancel an order, for example if an item is out of stock or the details
          provided are incorrect, and we will let you know.
        </p>
      </PolicySection>

      <PolicySection num="03" title="Prices & Payment">
        <PolicyList
          items={[
            "All prices are in Pakistani Rupees (PKR).",
            "Delivery charges, if any, are shown in your bag before you order.",
            "Payment is currently Cash on Delivery.",
            "We may change prices at any time. The price at the time you order applies.",
          ]}
        />
      </PolicySection>

      <PolicySection num="04" title="Products">
        <p>
          We try to show our products as accurately as possible. Colours may
          look slightly different on different screens, and small variations can
          occur in handmade or fabric details. Please choose sizes carefully.
        </p>
      </PolicySection>

      <PolicySection num="05" title="Delivery, Exchanges & Returns">
        <p>
          Delivery is covered in our{" "}
          <Link
            href="/delivery-info"
            className="underline underline-offset-4 hover:text-stone-900"
          >
            Delivery Information
          </Link>{" "}
          and exchanges in our{" "}
          <Link
            href="/exchange-policy"
            className="underline underline-offset-4 hover:text-stone-900"
          >
            Exchange &amp; Return Policy
          </Link>
          . Both form part of these terms.
        </p>
      </PolicySection>

      <PolicySection num="06" title="Limitation of Liability">
        <p>
          We do our best to keep the website available and accurate, but we
          cannot guarantee it will always be error free or uninterrupted. To the
          extent permitted by law, Little Meadow is not liable for indirect
          losses arising from the use of this website.
        </p>
      </PolicySection>

      <PolicySection num="07" title="Privacy">
        <p>
          How we handle your information is described in our{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-stone-900"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection num="08" title="Governing Law & Changes">
        <p>
          These terms are governed by the laws of Pakistan. We may update them
          from time to time, and the latest version will always be on this page.
        </p>
      </PolicySection>

      <PolicySection num="09" title="Contact Us">
        <p>
          WhatsApp: <strong>{CONTACT_WHATSAPP}</strong>
          <br />
          Instagram: <strong>{CONTACT_INSTAGRAM}</strong>
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
