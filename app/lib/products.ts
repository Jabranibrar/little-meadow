import { Product } from "../types";

export interface SupabaseProductRow {
  id: number | string;
  title?: string;
  name?: string;
  price: number;
  desc?: string;
  description?: string | null;
  category?: string;
  image?: string;
  images?: string[] | null;
  stock?: number;
  gender?: string;
}

export function mapProduct(item: SupabaseProductRow): Product {
  const gender = (item.gender ?? "").toLowerCase().trim();
  const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());

  const fromList = (item.images ?? []).filter(
    (s): s is string => typeof s === "string" && isUrl(s)
  );

  const images =
    fromList.length > 0
      ? fromList.map((s) => s.trim())
      : item.image && isUrl(item.image)
      ? [item.image.trim()]
      : [];

  return {
    id: Number(item.id),
    name: item.title || item.name || "Untitled Product",
    price: item.price,
    desc:
      item.desc ||
      `Category: ${item.category || "General"} | Stock: ${
        item.stock ?? "Available"
      }`,
    description: item.description || item.desc || "",
    category: (["boy", "girl", "unisex"].includes(gender)
      ? gender
      : "unisex") as Product["category"],
    image: images[0] || "",
    images,
  };
}
