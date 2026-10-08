import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { mapProduct, SupabaseProductRow } from "../../lib/products";
import ProductDetail from "../../components/ProductDetail";

async function getProduct(id: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapProduct(data as SupabaseProductRow) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.description.slice(0, 155) ||
      `${product.name} - Little Meadow kidswear`,
    openGraph: { images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
