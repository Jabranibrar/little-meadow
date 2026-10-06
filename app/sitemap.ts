import type { MetadataRoute } from "next";

const base = "https://little-meadow-pk.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/exchange-policy`, lastModified: new Date() },
  ];
}
