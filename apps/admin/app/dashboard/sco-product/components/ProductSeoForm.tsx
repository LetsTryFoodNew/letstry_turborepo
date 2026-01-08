"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { productSeoSchema, ProductSeoFormData } from "@/lib/validations/product-seo.schema";
import { Package } from "lucide-react";
import { Product, ProductSeo, useUpdateProductSeo } from "@/lib/products/useProducts";
import { SeoFields } from "@/components/seo/SeoFields";

interface ProductSeoFormProps {
  product: Product;
  existingSeo?: ProductSeo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductSeoForm({ product, existingSeo, onSuccess, onCancel }: ProductSeoFormProps) {
  const { updateProductSeo, loading: isLoading } = useUpdateProductSeo();

  const defaultMetaTitle = `${product.name}${product.brand ? ` | ${product.brand}` : ""} - Buy Online`;
  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() || "";
  const defaultMetaDescription = stripHtml(product.description || "").substring(0, 155);

  const methods = useForm<ProductSeoFormData>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: {
      productId: product._id,
      metaTitle: existingSeo?.metaTitle || defaultMetaTitle,
      metaDescription: existingSeo?.metaDescription || defaultMetaDescription,
      metaKeywords: existingSeo?.metaKeywords || [],
      canonicalUrl: existingSeo?.canonicalUrl || `https://letstryfoods.com/products/${product.slug}`,
      ogTitle: existingSeo?.ogTitle || "",
      ogDescription: existingSeo?.ogDescription || "",
      ogImage: existingSeo?.ogImage || product?.variants?.[0]?.images?.[0]?.url || "",
    },
  });

  const handleSubmit = async (data: ProductSeoFormData) => {
    try {
      await updateProductSeo(product._id, data);
      onSuccess();
    } catch (error) {
      console.error("Failed to save product SEO:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Product Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <p className="font-mono text-xs bg-background px-2 py-1 rounded">/{product.slug}</p>
              </div>
            </div>
            {product?.variants?.[0]?.images?.[0]?.url && (
              <div className="mt-2">
                <img
                  src={product.variants[0].images[0].url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <input type="hidden" {...methods.register("productId")} />

          <Separator />

          <SeoFields />

          <div className="flex justify-end space-x-4 pt-4 border-t sticky bottom-0 bg-background py-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : existingSeo?._id ? "Update SEO" : "Save SEO"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
