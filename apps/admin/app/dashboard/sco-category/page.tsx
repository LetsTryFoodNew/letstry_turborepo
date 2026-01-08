"use client";

import { useQuery } from "@apollo/client/react";
import { FolderTree, Search } from "lucide-react";
import { CategorySeoTable } from "./components/CategorySeoTable";
import { GET_CATEGORIES_WITH_SEO } from "@/lib/graphql/categories-seo";
import { SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { useSeoManagement } from "@/lib/seo/hooks/useSeoManagement";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CategorySeoPage() {
    const { data, loading, refetch } = useQuery<{
        categories: { items: any[] };
    }>(GET_CATEGORIES_WITH_SEO, {
        notifyOnNetworkStatusChange: true,
    });

    const categories = data?.categories?.items || [];

    const {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        stats,
        filteredItems,
    } = useSeoManagement(categories, ["name", "slug"]);

    return (
        <SeoPageLayout
            title="Category SEO Management"
            description="Manage SEO metadata for store categories and collections"
            icon={<FolderTree className="h-6 w-6" />}
            total={stats.total}
            configured={stats.configured}
            loading={loading}
            onRefresh={() => refetch()}
            statsLabels={{
                total: "Total Categories",
                configured: "SEO Configured",
                notConfigured: "Not Configured",
            }}
        >
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories by name or slug..."
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
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="configured">SEO Configured</SelectItem>
                        <SelectItem value="not-configured">Not Configured</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <CategorySeoTable
                categories={filteredItems}
                onRefresh={() => refetch()}
            />
        </SeoPageLayout>
    );
}
