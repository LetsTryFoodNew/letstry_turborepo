import { z } from "zod";

// Base SEO fields used by GenericSeoForm (Entities: Product, Category, Policy)
// These use array for keywords for better tag management
export const seoSchema = z.object({
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(70, "Meta title should be under 70 characters"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Meta description should be under 160 characters"),
  metaKeywords: z.array(z.string()),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogTitle: z.string().optional().or(z.literal("")),
  ogDescription: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
});

export type SeoFormData = z.infer<typeof seoSchema>;

// SEO Content schema for the older seo-content module (Static pages)
// This module uses string for keywords in its current implementation
export const seoContentSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  pageSlug: z.string().min(1, "Page slug is required"),
  metaTitle: z
    .string()
    .min(1, "Meta title is required")
    .max(70, "Meta title should be under 70 characters"),
  metaDescription: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Meta description should be under 160 characters"),
  metaKeywords: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogTitle: z.string().optional().or(z.literal("")),
  ogDescription: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type SeoContentFormData = z.infer<typeof seoContentSchema>;
