declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPurchase(value: number, orderId: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "purchase", {
    transaction_id: orderId,
    value,
    currency: "PKR",
  });
  window.fbq?.("track", "Purchase", { value, currency: "PKR" });
}
