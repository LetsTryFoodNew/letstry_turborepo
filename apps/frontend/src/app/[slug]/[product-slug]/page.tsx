import { getProductBySlug } from '@/lib/product';
import { getCategoriesByIds } from '@/lib/category/get-categories-by-ids';
import { ProductPageContainer } from '@/components/product-page/ProductPageContainer';
import { ProductDetails } from '@/components/product-page/ProductDetails';
import { ProductAccordion } from '@/components/product-page/ProductAccordion';
import { InfoTable } from '@/components/product-page/InfoTable';
import { CategoryProductsSections } from '@/components/product-page/CategoryProductsSections';
import { ProductBreadcrumb } from '@/components/product-page/ProductBreadcrumb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string; 'product-slug': string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'product-slug': productSlug } = await params;

  const product = await getProductBySlug(productSlug);
  if (product) {
    const seo = product.seo;
    const defaultTitle = product.name;
    const defaultDescription = product.description || `Buy ${product.name} online`;

    return {
      title: seo?.metaTitle || defaultTitle,
      description: seo?.metaDescription || defaultDescription,
      keywords: seo?.metaKeywords || [],
      alternates: {
        canonical: seo?.canonicalUrl || undefined,
      },
      openGraph: {
        title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
        description: seo?.ogDescription || seo?.metaDescription || defaultDescription,
        images: seo?.ogImage
          ? [{ url: seo.ogImage }]
          : product?.defaultVariant?.images?.[0]?.url
            ? [{ url: product.defaultVariant.images[0].url }]
            : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
        description: seo?.ogDescription || seo?.metaDescription || defaultDescription,
        images: seo?.ogImage
          ? [seo.ogImage]
          : product?.defaultVariant?.images?.[0]?.url
            ? [product.defaultVariant.images[0].url]
            : [],
      },
    };
  }

  return {
    title: 'Product Not Found | Letstry',
    description: 'The requested product could not be found.',
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { 'product-slug': productSlug, slug: categorySlug } = await params;
  const { type } = await searchParams;

  try {
    const product = await getProductBySlug(productSlug);
    if (product) {
      const variant = type === 'special' ? 'special' : 'default';
      
      const categories = await getCategoriesByIds(product.categoryIds || []);
      const primaryCategory = categories.find(cat => cat.slug === categorySlug) || categories[0];
      
      const breadcrumbItems = [];
      if (primaryCategory) {
        breadcrumbItems.push({
          label: primaryCategory.name,
          href: `/${primaryCategory.slug}`,
        });
      }
      breadcrumbItems.push({
        label: product.name,
      });
      
      const productInfo = [
        { label: 'Description', value: product.description || '' },
        {
          label: 'Unit',
          value:
            product.defaultVariant?.packageSize ||
            `${product.defaultVariant?.weight} ${product.defaultVariant?.weightUnit || ''}`,
        },
        { label: 'Shelf life', value: product.shelfLife || '' },
        {
          label: 'Diet preference',
          value: product.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian',
        },
        {
          label: 'Disclaimer',
          value:
            'Every effort is made to maintain the accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to solely rely on the information presented.',
        },
      ];

      if (product.ingredients) {
        productInfo.splice(1, 0, {
          label: 'Ingredients',
          value: product.ingredients,
        });
      }

      return (
        <ProductPageContainer variant={variant}>
          <ProductDetails product={product} breadcrumbItems={breadcrumbItems} />
          <ProductAccordion title="Product Info">
            <InfoTable data={productInfo} />
          </ProductAccordion>
          <CategoryProductsSections categoryIds={product.categoryIds} />
        </ProductPageContainer>
      );
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  notFound();
}
