'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.api';
import type { ProductFilters, ProductPaginationResponse } from '../types';

export function useProducts(
  filters?: ProductFilters
) {
  return useQuery<ProductPaginationResponse>({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 60 * 1000, // Cache 1 phút
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đang fetch
  });
}





