import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://little-meadow-pk.vercel.app"),
  title: {
    default: "Little Meadow | Kidswear 1-5 Years",
    template: "%s | Little Meadow",
  },
  description:
    "Little Meadow by Ayra & Hadin. Thoughtful, premium kidswear for ages 1 to 5, made for little moments.",
  openGraph: {
    title: "Little Meadow | Kidswear 1-5 Years",
    description: "Thoughtful kidswear for daily adventures.",
    url: "/",
    siteName: "Little Meadow",
    images: ["/little-meadow.jpeg"],
    type: "website",
  },
  verification: {
    google: "fQfVd78JwXIjIk6FErDL83WdOxIGNtVqKr4ULelV2I4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable}`}>
      <body>
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/little-meadow.jpeg')" }}
        />
        <div aria-hidden className="fixed inset-0 -z-10 bg-[#faf8f5]/70" />
        {children}
      </body>
    </html>
  );
}
