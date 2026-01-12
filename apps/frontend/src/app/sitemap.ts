import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://krsna.site';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admin-api.krsna.site';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const productsResponse = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 3600 },
    });
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug || product.id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  try {
    const categoriesResponse = await fetch(`${apiUrl}/categories`, {
      next: { revalidate: 3600 },
    });
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      categoryRoutes = categories.map((category: any) => ({
        url: `${baseUrl}/categories/${category.slug || category.id}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
