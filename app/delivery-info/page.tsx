import type { Metadata } from "next";
import PolicyLayout, {
  PolicySection,
  PolicyList,
} from "../components/PolicyLayout";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_ABOVE,
  DELIVERY_DAYS,
  PROCESSING_DAYS,
  CONTACT_WHATSAPP,
} from "../lib/config";

export const metadata: Metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <PolicyLayout
      title="Delivery Information"
      intro="How and when your little one's outfit reaches you."
    >
      <PolicySection num="01" title="Delivery Time">
        <p>
          After you confirm your order, we prepare it within{" "}
          <strong>{PROCESSING_DAYS}</strong>. It then reaches you in{" "}
          <strong>{DELIVERY_DAYS}</strong>. Remote areas may take a little
          longer.
        </p>
      </PolicySection>

      <PolicySection num="02" title="Delivery Charges">
        <PolicyList
          items={[
            `Rs. ${DELIVERY_FEE.toLocaleString(
              "en-PK"
            )} for orders below Rs. ${FREE_DELIVERY_ABOVE.toLocaleString(
              "en-PK"
            )}.`,
            `Free delivery on Rs. ${FREE_DELIVERY_ABOVE.toLocaleString(
              "en-PK"
            )} and above.`,
            "Pay the total in cash to the courier when your parcel arrives.",
          ]}
        />
      </PolicySection>

      <PolicySection num="03" title="Receiving Your Parcel">
        <p>
          Please check your parcel when it arrives. If it looks damaged or
          opened, take photos or a video before opening it and message us
          straight away.
        </p>
      </PolicySection>

      <PolicySection num="04" title="Need Help?">
        <p>
          Message us on WhatsApp at <strong>{CONTACT_WHATSAPP}</strong> with
          your order number.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
