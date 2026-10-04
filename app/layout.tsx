import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Meadow | Premium Kidswear (1-5 Years)",
  description:
    "Shop comfortable, high-quality everyday clothing and playsets for kids aged 1 to 5 years. Order easily via WhatsApp.",
  keywords:
    "kidswear, baby clothes Pakistan, children clothing online, little meadow, kids tshirts joggers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
