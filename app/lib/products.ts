import { Product } from "../types";
import { DEFAULT_SIZES } from "./config";

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
  stock?: number | null;
  gender?: string | null;
  sizes?: string[] | null;
  available_sizes?: string[] | null;
  fabric?: string | null;
  occasion?: string | null;
  pieces?: string | null;
  care?: string | null;
  highlights?: string[] | null;
  colors?: string[] | null;
}

const norm = (s?: string | null) =>
  (s ?? "").toLowerCase().replace(/[\s_-]/g, "");

const CATS: Record<string, Product["category"]> = {
  boy: "boy",
  boys: "boy",
  girl: "girl",
  girls: "girl",
  unisex: "unisex",
  newborn: "newborn",
  frock: "frocks",
  frocks: "frocks",
};

export function mapProduct(item: SupabaseProductRow): Product {
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
  const sizes =
    item.sizes && item.sizes.length > 0 ? item.sizes : DEFAULT_SIZES;
  const availableSizes = item.available_sizes
    ? sizes.filter((s) => item.available_sizes!.includes(s))
    : sizes;
  const colors = (item.colors ?? [])
    .map((raw) => {
      const [name, hex, imgs] = String(raw).split("|");
      const h = (hex ?? "").trim();
      return {
        name: (name ?? "").trim(),
        hex: /^#[0-9a-f]{3,8}$/i.test(h) ? h : "#d6d3d1",
        images: (imgs ?? "")
          .split(";")
          .map((s) => s.trim())
          .filter(isUrl),
      };
    })
    .filter((c) => c.name);

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
    category: CATS[norm(item.gender)] ?? CATS[norm(item.category)] ?? "unisex",
    image: images[0] || "",
    images,
    sizes,
    availableSizes,
    fabric: item.fabric ?? "",
    occasion: item.occasion ?? "",
    pieces: item.pieces ?? "",
    care: item.care ?? "",
    highlights: (item.highlights ?? []).filter(Boolean),
    colors,
    stock: typeof item.stock === "number" ? item.stock : null,
  };
}
export function getGallery(p: Product): string[] {
  const fromColors = p.colors.flatMap((c) => c.images);
  return [...new Set([...fromColors, ...p.images])];
}

export function colorImageIndex(
  gallery: string[],
  p: Product,
  name?: string
): number {
  const first = p.colors.find((c) => c.name === name)?.images[0];
  const i = first ? gallery.indexOf(first) : 0;
  return i < 0 ? 0 : i;
}
