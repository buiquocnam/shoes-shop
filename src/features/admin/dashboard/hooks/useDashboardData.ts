'use client';

import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../services';
import type { DateRange } from '../types';
import { format } from 'date-fns';

export function useDashboardData(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['admin', 'dashboard', dateRange],
    queryFn: () => {
      const params: { fromDate?: string; toDate?: string } = {};
      if (dateRange?.from) {
        params.fromDate = format(dateRange.from, 'yyyy-MM-dd');
      }
      if (dateRange?.to) {
        params.toDate = format(dateRange.to, 'yyyy-MM-dd');
      }
      return adminDashboardApi.getDashboardData(params);
    },
    enabled: !!dateRange?.from && !!dateRange?.to,
  });
}

