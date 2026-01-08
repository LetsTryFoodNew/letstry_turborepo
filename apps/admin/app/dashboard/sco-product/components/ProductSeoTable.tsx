"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductSeoForm } from "./ProductSeoForm";
import { DeleteProductSeoDialog } from "./DeleteProductSeoDialog";
import { Product, ProductSeo, useUpdateProductSeo } from "@/lib/products/useProducts";
import { GenericSeoTable } from "@/components/seo/GenericSeoTable";
import { Image as ImageIcon } from "lucide-react";

interface ProductSeoTableProps {
  products: Product[];
  onRefresh: () => void;
  loading: boolean;
}

export function ProductSeoTable({ products, onRefresh, loading }: ProductSeoTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { updateProductSeo, loading: isDeleting } = useUpdateProductSeo();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    onRefresh();
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct?._id) return;
    try {
      await updateProductSeo(selectedProduct._id, {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete product SEO:", error);
    }
  };

  const columns = [
    {
      header: "Image",
      render: (p: Product) => (
        p?.variants?.[0]?.images?.[0]?.url ? (
          <img
            src={p.variants[0].images[0].url}
            alt={p.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      ),
    },
    {
      header: "Product Name",
      render: (p: Product) => (
        <div className="flex flex-col">
          <span className="font-medium">{p.name}</span>
          {p.brand && <span className="text-xs text-muted-foreground">{p.brand}</span>}
        </div>
      ),
    },
    {
      header: "Slug",
      render: (p: Product) => <code className="px-2 py-1 bg-muted rounded text-xs">/{p.slug}</code>,
    },
  ];

  if (loading && products.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Loading products...</div>;
  }

  return (
    <>
      <GenericSeoTable
        items={products}
        columns={columns}
        hasSeo={(p) => !!(p.seo && p.seo.metaTitle)}
        getSeoTitle={(p) => p.seo?.metaTitle}
        getSeoDesc={(p) => p.seo?.metaDescription}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowKey={(p) => p._id}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.seo ? "Edit" : "Add"} SEO for {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductSeoForm
              product={selectedProduct}
              existingSeo={selectedProduct.seo}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteProductSeoDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name || ""}
        loading={isDeleting}
      />
    </>
  );
}
