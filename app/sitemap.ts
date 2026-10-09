import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

const base = "https://little-meadow-pk.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("products").select("id");
  const products = (data ?? []).map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/exchange-policy`, lastModified: new Date() },
    { url: `${base}/delivery-info`, lastModified: new Date() },
    { url: `${base}/privacy-policy`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
    ...products,
  ];
}
