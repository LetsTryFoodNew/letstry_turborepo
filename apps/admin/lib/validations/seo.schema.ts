import { z } from "zod";
import { seoBaseSchema } from "./seo-common.schema";

export const seoContentSchema = z.object({
  ...seoBaseSchema,
  pageName: z
    .string()
    .min(1, "Page name is required")
    .max(100, "Page name must be less than 100 characters"),
  pageSlug: z
    .string()
    .min(1, "Page slug is required")
    .max(100, "Page slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  isActive: z.boolean(),
});

export type SeoContentFormData = z.infer<typeof seoContentSchema>;
