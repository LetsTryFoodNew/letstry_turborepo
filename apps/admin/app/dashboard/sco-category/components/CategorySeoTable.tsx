"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategorySeoForm } from "./CategorySeoForm";
import { DeleteCategorySeoDialog } from "./DeleteCategorySeoDialog";
import { GenericSeoTable } from "@/components/seo/GenericSeoTable";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    seo?: {
        _id: string;
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords: string[];
    } | null;
}

interface CategorySeoTableProps {
    categories: Category[];
    onRefresh: () => void;
}

export function CategorySeoTable({ categories, onRefresh }: CategorySeoTableProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedCategory(null);
        onRefresh();
    };

    const handleDeleteSuccess = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        onRefresh();
    };

    const columns = [
        {
            header: "Category Name",
            render: (c: Category) => <span className="font-medium">{c.name}</span>,
        },
        {
            header: "Slug",
            render: (c: Category) => <span className="font-mono text-xs">/{c.slug}</span>,
        },
    ];

    return (
        <>
            <GenericSeoTable
                items={categories}
                columns={columns}
                hasSeo={(c) => !!c.seo}
                getSeoTitle={(c) => c.seo?.metaTitle}
                getSeoDesc={(c) => c.seo?.metaDescription}
                onEdit={handleEdit}
                onDelete={handleDelete}
                rowKey={(c) => c._id}
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory?.seo ? "Edit" : "Add"} SEO for {selectedCategory?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <CategorySeoForm
                            category={selectedCategory}
                            existingSeo={selectedCategory.seo as any}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {categoryToDelete && (
                <DeleteCategorySeoDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    category={categoryToDelete}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </>
    );
}
