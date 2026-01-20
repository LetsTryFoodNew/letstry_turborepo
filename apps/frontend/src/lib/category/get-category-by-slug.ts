import { createServerGraphQLClient } from '@/lib/graphql/server-client-factory';
import { GET_CATEGORY_BY_SLUG } from '@/lib/queries/categories';
import type { GetCategoryBySlugQuery } from '@/gql/graphql';

export async function getCategoryBySlug(slug: string): Promise<GetCategoryBySlugQuery['categoryBySlug']> {
  const client = createServerGraphQLClient();
  
  const queryString = (GET_CATEGORY_BY_SLUG as unknown as { value: string }).value;
  
  const data = await client.request<GetCategoryBySlugQuery>(
    queryString,
    {
      slug,
      includeArchived: false,
    }
  );

  return data.categoryBySlug;
}
