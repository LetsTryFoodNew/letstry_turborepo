import { graphql } from '@/gql';

export const SEARCH_CATEGORIES = graphql(`
  query SearchCategories($searchTerm: String!, $pagination: PaginationInput) {
    searchCategories(searchTerm: $searchTerm, pagination: $pagination) {
      items {
        _id
        id
        name
        slug
        imageUrl
        productCount
        isArchived
      }
      meta {
        totalCount
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);
