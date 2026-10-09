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
      intro="We want every little outfit to reach you safely and on time. Here is everything you need to know about how we deliver."
    >
      <PolicySection num="01" title="Delivery Time">
        <p>
          Orders are prepared within <strong>{PROCESSING_DAYS}</strong> of
          confirmation. Delivery then usually takes{" "}
          <strong>{DELIVERY_DAYS}</strong> across Pakistan. Remote areas may
          take a little longer.
        </p>
      </PolicySection>

      <PolicySection num="02" title="Delivery Charges">
        <PolicyList
          items={[
            `A flat delivery charge of Rs. ${DELIVERY_FEE.toLocaleString(
              "en-PK"
            )} applies to orders below Rs. ${FREE_DELIVERY_ABOVE.toLocaleString(
              "en-PK"
            )}.`,
            `Delivery is free on orders of Rs. ${FREE_DELIVERY_ABOVE.toLocaleString(
              "en-PK"
            )} and above.`,
            "The exact delivery charge is shown in your bag before you place the order.",
          ]}
        />
      </PolicySection>

      <PolicySection num="03" title="Cash on Delivery">
        <p>
          Payment is currently Cash on Delivery. Please keep the exact amount
          ready when the courier arrives.
        </p>
      </PolicySection>

      <PolicySection num="04" title="Order Confirmation">
        <p>
          After you place an order, we will message you on WhatsApp with your
          order details. Please reply <strong>CONFIRM</strong> so we can
          dispatch your parcel. Please make sure your mobile number and address
          are correct.
        </p>
      </PolicySection>

      <PolicySection num="05" title="Receiving Your Parcel">
        <p>
          Please inspect your parcel when possible. If it looks badly damaged or
          tampered with, take photos or a video before opening it and contact us
          immediately. Delays caused by the courier company are outside our
          direct control, but we will always help you resolve them.
        </p>
      </PolicySection>

      <PolicySection num="06" title="Need Help?">
        <p>
          Message us on WhatsApp at <strong>{CONTACT_WHATSAPP}</strong> with
          your order number and we will be happy to help.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
