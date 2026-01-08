"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { seoContentSchema, SeoContentFormData } from "@/lib/validations/seo.schema";
import { SeoContent } from "@/lib/seo/useSeo";
import { SeoFields } from "@/components/seo/SeoFields";

interface SeoFormProps {
  initialData?: SeoContent | null;
  onSubmit: (data: SeoContentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "combos", label: "Combos Page" },
  { value: "about-us", label: "About Us" },
  { value: "contact", label: "Contact Page" },
  { value: "search", label: "Search Page" },
  { value: "products", label: "Products Page" },
  { value: "categories", label: "Categories Page" },
  { value: "cart", label: "Cart Page" },
  { value: "checkout", label: "Checkout Page" },
  { value: "faq", label: "FAQ Page" },
  { value: "privacy-policy", label: "Privacy Policy" },
  { value: "terms-of-service", label: "Terms of Service" },
  { value: "refund-policy", label: "Refund & Cancellations" },
  { value: "shipping-policy", label: "Shipping Policy" },
  { value: "address-details", label: "Address Details" },
];

export function SeoForm({ initialData, onSubmit, onCancel, isLoading }: SeoFormProps) {
  const methods = useForm<SeoContentFormData>({
    resolver: zodResolver(seoContentSchema),
    defaultValues: {
      pageName: initialData?.pageName || "",
      pageSlug: initialData?.pageSlug || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords ? initialData.metaKeywords.split(",").map(k => k.trim()) : [],
      canonicalUrl: initialData?.canonicalUrl || "",
      ogTitle: initialData?.ogTitle || "",
      ogDescription: initialData?.ogDescription || "",
      ogImage: initialData?.ogImage || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const handlePageSelect = (slug: string) => {
    const page = PAGE_OPTIONS.find((p) => p.value === slug);
    if (page) {
      methods.setValue("pageSlug", slug);
      methods.setValue("pageName", page.label);
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="pageSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Slug *</FormLabel>
                    <Select onValueChange={handlePageSelect} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAGE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      {...field}
                      placeholder="Or enter custom slug"
                      className="mt-2"
                    />
                    <FormDescription>URL identifier (lowercase, hyphens only)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 pt-8">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <SeoFields />

          <div className="flex justify-end space-x-4 pt-4 border-t sticky bottom-0 bg-background py-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update SEO" : "Create SEO"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
