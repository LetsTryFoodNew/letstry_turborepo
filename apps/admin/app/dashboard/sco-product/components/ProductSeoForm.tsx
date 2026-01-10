"use client";

import { GenericSeoForm } from "@/components/seo/GenericSeoForm";
import { Product, ProductSeo, useUpdateProductSeo } from "@/lib/products/useProducts";
import { SeoFormData } from "@/lib/validations/seo.schema";

interface ProductSeoFormProps {
  product: Product;
  existingSeo?: ProductSeo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductSeoForm({ product, existingSeo, onSuccess, onCancel }: ProductSeoFormProps) {
  const { updateProductSeo, loading: isLoading } = useUpdateProductSeo();

  const handleSubmit = async (data: SeoFormData) => {
    try {
      await updateProductSeo(product._id, {
        ...data,
        metaKeywords: data.metaKeywords || [],
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to save product SEO:", error);
    }
  };

  return (
    <GenericSeoForm
      initialData={existingSeo as any}
      entityName={product.name}
      entitySlug={product.slug}
      entityType="Product"
      entityImageUrl={product?.variants?.[0]?.images?.[0]?.url || ""}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
}
