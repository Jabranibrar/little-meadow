import type { Metadata } from "next";
import PolicyLayout, {
  PolicySection,
  PolicyList,
} from "../components/PolicyLayout";
import { CONTACT_WHATSAPP, CONTACT_INSTAGRAM } from "../lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro="Your trust matters to us. This policy explains what information Little Meadow by Ayra & Hadin collects, why we collect it, and how we look after it."
    >
      <PolicySection num="01" title="Information We Collect">
        <p>When you place an order or contact us, we collect:</p>
        <PolicyList
          items={[
            "Your name, mobile number and email address",
            "Your city and delivery address",
            "The items you order, their sizes and the order total",
            "Any message you send us through the website",
          ]}
        />
        <p>
          We do not collect or store card or bank details on this website.
          Payment is currently Cash on Delivery.
        </p>
      </PolicySection>

      <PolicySection num="02" title="How We Use It">
        <PolicyList
          items={[
            "To process, confirm and deliver your order",
            "To contact you on WhatsApp or phone about your order",
            "To reply to your questions and handle exchanges",
            "To keep our order records and improve our store",
          ]}
        />
      </PolicySection>

      <PolicySection num="03" title="Who We Share It With">
        <p>
          We <strong>never sell</strong> your personal information. We share
          only what is needed with:
        </p>
        <PolicyList
          items={[
            "Courier companies, to deliver your parcel",
            "Service providers that run our website, database and email (hosting, data storage and email delivery)",
            "Authorities, only where required by law",
          ]}
        />
      </PolicySection>

      <PolicySection num="04" title="Cookies & Analytics">
        <p>
          We may use cookies and analytics tools (such as Google Analytics or
          Meta Pixel) to understand how visitors use our website and to measure
          our advertising. Your shopping bag is saved in your own browser so it
          is still there when you return. You can clear this at any time from
          your browser settings.
        </p>
      </PolicySection>

      <PolicySection num="05" title="Data Security & Retention">
        <p>
          We take reasonable steps to protect your information. Order records
          are kept only as long as needed for delivery, exchanges, accounting
          and legal purposes.
        </p>
      </PolicySection>

      <PolicySection num="06" title="Your Choices">
        <p>
          You can ask us to correct or delete your personal information, or stop
          contacting you, at any time. Contact us and we will respond as soon as
          we can.
        </p>
      </PolicySection>

      <PolicySection num="07" title="Children">
        <p>
          Our products are for children, but our website is meant for parents
          and guardians. We do not knowingly collect information from children.
        </p>
      </PolicySection>

      <PolicySection num="08" title="Changes to This Policy">
        <p>
          We may update this policy from time to time. The latest version will
          always be available on this page.
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
