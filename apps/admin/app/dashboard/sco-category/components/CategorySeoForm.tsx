"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { categorySeoSchema, CategorySeoFormData } from "@/lib/validations/category-seo.schema";
import { FolderTree } from "lucide-react";
import { useUpdateCategorySeo, CategorySeo } from "@/lib/category-seo/useCategorySeo";
import { SeoFields } from "@/components/seo/SeoFields";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
}

interface CategorySeoFormProps {
    category: Category;
    existingSeo?: CategorySeo | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategorySeoForm({ category, existingSeo, onSuccess, onCancel }: CategorySeoFormProps) {
    const { updateCategorySeo, loading: isLoading } = useUpdateCategorySeo();

    const defaultMetaTitle = `${category.name} - Shop Online | LetsTry Foods`;
    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() || "";
    const defaultMetaDescription = stripHtml(category.description || "").substring(0, 155);

    const methods = useForm<CategorySeoFormData>({
        resolver: zodResolver(categorySeoSchema),
        defaultValues: {
            categoryId: category._id,
            metaTitle: existingSeo?.metaTitle || defaultMetaTitle,
            metaDescription: existingSeo?.metaDescription || defaultMetaDescription,
            metaKeywords: existingSeo?.metaKeywords || [],
            canonicalUrl: existingSeo?.canonicalUrl || `https://letstryfoods.com/categories/${category.slug}`,
            ogTitle: existingSeo?.ogTitle || "",
            ogDescription: existingSeo?.ogDescription || "",
            ogImage: existingSeo?.ogImage || category?.imageUrl || "",
        },
    });

    const handleSubmit = async (data: CategorySeoFormData) => {
        try {
            await updateCategorySeo(category._id, data);
            onSuccess();
        } catch (error) {
            console.error("Failed to save category SEO:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                            <FolderTree className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Category Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Name:</span>
                                <p className="font-medium">{category.name}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Slug:</span>
                                <p className="font-mono text-xs bg-background px-2 py-1 rounded">/{category.slug}</p>
                            </div>
                        </div>
                        {category?.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    <input type="hidden" {...methods.register("categoryId")} />

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
