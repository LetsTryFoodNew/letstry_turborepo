'use client';

import { useGraphQLQuery, defaultGraphQLQueryOptions } from '@/lib/graphql/use-graphql-query';
import { SEARCH_CATEGORIES } from './category-query';
import type { SearchCategoriesQuery, SearchCategoriesQueryVariables } from '@/gql/graphql';

export function useSearchCategories(searchTerm: string, page: number = 1, limit: number = 20) {
    const trimmedSearchTerm = searchTerm.trim();

    return useGraphQLQuery<SearchCategoriesQuery, SearchCategoriesQueryVariables>(
        ['searchCategories', trimmedSearchTerm, page, limit],
        SEARCH_CATEGORIES.toString(),
        {
            searchTerm: trimmedSearchTerm || ' ',
            pagination: { page, limit },
        },
        {
            ...defaultGraphQLQueryOptions,
            enabled: true,
            staleTime: 0,
        }
    );
}
