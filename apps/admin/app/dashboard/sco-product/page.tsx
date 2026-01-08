"use client";

import { Package, Search } from "lucide-react";
import { useProductSeoPage } from "@/hooks/useProductSeoPage";
import { ProductSeoTable } from "./components/ProductSeoTable";
import { Pagination } from "../components/pagination";
import { SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductSeoPage() {
  const {
    products,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    refetchProducts,
    currentPage,
    setCurrentPage,
    pageSize,
    paginationMeta,
  } = useProductSeoPage();

  return (
    <SeoPageLayout
      title="Product SEO Management"
      description="Manage SEO metadata for each product to improve search visibility"
      icon={<Package className="h-6 w-6" />}
      total={stats.totalProducts}
      configured={stats.configuredCount}
      loading={isLoading}
      onRefresh={() => refetchProducts()}
      statsLabels={{
        total: "Total Products",
        configured: "SEO Configured",
        notConfigured: "Not Configured",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="configured">SEO Configured</SelectItem>
            <SelectItem value="not-configured">Not Configured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductSeoTable
        products={products}
        loading={isLoading}
        onRefresh={() => refetchProducts()}
      />

      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationMeta.totalPages}
          totalCount={paginationMeta.totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          hasNextPage={paginationMeta.hasNextPage}
          hasPreviousPage={paginationMeta.hasPreviousPage}
        />
      )}
    </SeoPageLayout>
  );
}