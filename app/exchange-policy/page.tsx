import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange & Return Policy | Little Meadow",
  description: "Exchange and return policy for Little Meadow by Ayra & Hadin.",
};

function BackArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6 sm:py-8 md:py-10 border-b border-stone-200 last:border-b-0">
      <h2 className="flex items-baseline gap-2.5 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-stone-900 mb-3 sm:mb-4 leading-snug">
        <span className="text-xs sm:text-sm font-sans font-semibold tracking-widest text-stone-400">
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] md:text-base leading-relaxed text-stone-700">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 sm:gap-3">
          <span className="mt-2 sm:mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base sm:text-lg md:text-xl font-serif italic text-stone-900 pt-1 sm:pt-2">
      {children}
    </h3>
  );
}

export default function ExchangePolicyPage() {
  return (
    <div className="min-h-screen">
      <header className="h-16 md:h-20 flex items-center justify-between px-[5%] sm:px-[6%] sticky top-0 z-40 border-b border-stone-200 backdrop-blur-md bg-white/70">
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-900 transition-colors"
        >
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-stone-300 bg-white/80 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
            <BackArrow />
          </span>
          <span className="hidden sm:inline">Back to Store</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <span className="font-serif text-lg sm:text-xl md:text-2xl text-stone-900">
          Little Meadow
        </span>
      </header>

      <main className="px-[4%] sm:px-[6%] py-8 sm:py-12 md:py-20">
        <article className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm px-5 py-8 sm:px-8 sm:py-12 md:px-14 md:py-16">
          <div className="text-center m-0">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-stone-500 mb-3 sm:mb-4">
              Policies
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-stone-900 leading-tight">
              Exchange &amp; Return Policy
            </h1>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6 mb-6 sm:mt-8 sm:mb-8" />
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-700 max-w-2xl mx-auto">
              At <strong>Little Meadow by Ayra &amp; Hadin</strong>, we want
              every little outfit to reach you in perfect condition. We
              carefully check each order before dispatch, but we understand that
              sometimes a size or product may not work out.
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-3 sm:mt-4">
              Please read our policy below before placing your order.
            </p>
          </div>

          <Section num="01" title="Exchange Policy">
            <p>
              We offer exchanges within{" "}
              <strong>7 days of receiving your order</strong>.
            </p>
            <p>An exchange is possible if:</p>
            <List
              items={[
                "The size does not fit and you need another available size.",
                "You received a different item from the one you ordered.",
                "The item has a manufacturing defect.",
                "The item was damaged before or during delivery.",
              ]}
            />
            <p>The item must be:</p>
            <List
              items={[
                "Unworn and unused",
                "Unwashed",
                "In its original condition",
                "With all original tags, labels and packaging attached",
                "Free from perfume, makeup, stains, pet hair or any other signs of use",
              ]}
            />
            <SubHeading>Size Exchange</SubHeading>
            <p>
              If you ordered the wrong size, we are happy to exchange it for
              another available size.
            </p>
            <p>
              However,{" "}
              <strong>size exchanges are subject to availability</strong>. If
              the requested size is unavailable, we may offer another suitable
              size or store credit.
            </p>
            <p>
              For size-related exchanges, the customer is responsible for the
              return/courier charges.
            </p>
          </Section>

          <Section num="02" title="Damaged or Incorrect Items">
            <p>
              If you receive an incorrect, damaged or defective item, please
              contact us within <strong>48 hours of delivery</strong>.
            </p>
            <p>Please send us:</p>
            <List
              items={[
                "Your order number",
                "Clear photos/videos of the item",
                "A photo of the packaging, if applicable",
              ]}
            />
            <p>
              Once the issue is verified,{" "}
              <strong>
                Little Meadow will cover the reasonable return/exchange delivery
                cost
              </strong>{" "}
              and provide a replacement or another appropriate solution.
            </p>
            <p>
              Please do not return an item before contacting us and receiving
              confirmation from our team.
            </p>
          </Section>

          <Section num="03" title="Returns & Refunds">
            <p>
              We generally do{" "}
              <strong>
                not offer cash refunds for change of mind, incorrect size
                selection, or personal preference
              </strong>
              .
            </p>
            <p>Instead, eligible customers may receive:</p>
            <List
              items={[
                "An exchange for another size, subject to availability, or",
                "Store credit for the value of the returned item.",
              ]}
            />
            <p>
              Store credit can be used on a future purchase and will not have an
              expiry date.
            </p>
            <SubHeading>Cash Refunds</SubHeading>
            <p>
              Cash refunds will only be considered in exceptional circumstances,
              such as:
            </p>
            <List
              items={[
                "The ordered item is unavailable and cannot be replaced.",
                "We are unable to provide a suitable replacement for an incorrect or defective item.",
              ]}
            />
            <p>
              Any approved refund will be made through the available payment
              method and may take several business days to process.
            </p>
          </Section>

          <Section num="04" title="Sale & Discounted Items">
            <p>
              Items purchased during a{" "}
              <strong>
                sale, clearance promotion, flash sale or special discount
              </strong>{" "}
              are generally <strong>not eligible for exchange or return</strong>
              , unless the item is defective or we sent the wrong item.
            </p>
            <p>
              Any special promotion with different exchange conditions will
              clearly mention those conditions at the time of purchase.
            </p>
          </Section>

          <Section num="05" title="Customized & Made-to-Order Items">
            <p>
              Customized, personalized or made-to-order products{" "}
              <strong>
                cannot be returned or exchanged due to change of mind or size
                preference
              </strong>
              , as they are prepared specifically for you.
            </p>
            <p>
              If a customized item arrives defective or different from what was
              ordered, please contact us within 48 hours of delivery.
            </p>
          </Section>

          <Section num="06" title="Hygiene & Product Condition">
            <p>
              For the safety and hygiene of all our little customers, we cannot
              accept items that have been worn, washed, altered or damaged after
              delivery.
            </p>
            <p>
              Please check the size and product carefully before removing tags
              or washing the item.
            </p>
          </Section>

          <Section num="07" title="How to Request an Exchange">
            <p>To request an exchange:</p>
            <ol className="space-y-3 sm:space-y-4">
              {[
                "Contact Little Meadow within the applicable exchange period.",
                "Provide your order number and reason for exchange.",
                "Send photographs/videos if requested by our team.",
                "Once your request is approved, our team will provide return instructions.",
                "Send the item back in its original condition and packaging.",
                "Once the returned item is received and inspected, your replacement will be processed.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3 sm:gap-4">
                  <span className="shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-stone-300 bg-stone-50 flex items-center justify-center text-[11px] sm:text-xs font-bold text-stone-700">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 sm:pt-1">
                    <strong className="font-semibold text-stone-900">
                      Step {i + 1}:
                    </strong>{" "}
                    {t}
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <Section num="08" title="Important Note About Courier Deliveries">
            <p>
              Please inspect your parcel when possible. If the package appears
              severely damaged or tampered with, please take photographs/videos
              before opening it and contact us immediately.
            </p>
            <p>
              Once an order has been dispatched, delivery delays caused by the
              courier company are outside Little Meadow&apos;s direct control.
              However, our team will always do its best to assist you in
              resolving delivery issues.
            </p>
          </Section>

          <Section num="09" title="Exchange Processing Time">
            <p>
              After we receive your returned item, it will be inspected.
              Approved exchanges are generally processed within{" "}
              <strong>3–5 business days</strong>, subject to product
              availability and courier schedules.
            </p>
          </Section>

          <Section num="10" title="Our Promise">
            <p>
              We are a growing little brand built with lots of love, and we want
              every Little Meadow customer to feel confident shopping with us.
            </p>
            <p>
              If something isn&apos;t right with your order,{" "}
              <strong>please reach out to us before worrying</strong>.
              We&apos;ll always try to find a fair and reasonable solution.
            </p>
          </Section>

          <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-stone-300 text-center">
            <p className="text-sm font-semibold tracking-wide text-stone-900">
              Little Meadow by Ayra &amp; Hadin
            </p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-stone-500 mt-2 italic">
              Made with love for little moments.
            </p>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 mt-6 sm:mt-8 bg-stone-900 text-white px-6 sm:px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
            >
              <BackArrow />
              Back to Store
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
