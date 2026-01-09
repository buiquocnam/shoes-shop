'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '../services';
import { format } from 'date-fns';

export function RevenueSummary() {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const { data: todayData, isLoading: isLoadingToday } = useQuery({
        queryKey: ['admin', 'dashboard', 'today'],
        queryFn: () => adminDashboardApi.getDashboardData({
            fromDate: format(startOfToday, 'yyyy-MM-dd'),
            toDate: format(endOfToday, 'yyyy-MM-dd'),
        }),
    });

    const { data: monthData, isLoading: isLoadingMonth } = useQuery({
        queryKey: ['admin', 'dashboard', 'this-month'],
        queryFn: () => adminDashboardApi.getDashboardData({
            fromDate: format(startOfMonth, 'yyyy-MM-dd'),
            toDate: format(endOfMonth, 'yyyy-MM-dd'),
        }),
    });

    const todayRevenue = todayData?.totalRevenue || 0;
    const monthRevenue = monthData?.totalRevenue || 0;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Today Revenue */}
            <Card className="relative overflow-hidden border-none shadow-lg ring-1 ring-emerald-500/20 bg-white dark:bg-slate-900 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Doanh thu hôm nay
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    {isLoadingToday ? (
                        <Skeleton className="h-10 w-40" />
                    ) : (
                        <div className="space-y-3">
                            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {formatCurrency(todayRevenue)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* This Month Revenue */}
            <Card className="relative overflow-hidden border-none shadow-lg ring-1 ring-blue-500/20 bg-white dark:bg-slate-900 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Doanh thu tháng này
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    {isLoadingMonth ? (
                        <Skeleton className="h-10 w-40" />
                    ) : (
                        <div className="space-y-3">
                            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {formatCurrency(monthRevenue)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

