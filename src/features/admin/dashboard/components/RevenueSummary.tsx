'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Today Revenue */}
            <Card className="border-2 bg-gradient-to-br from-chart-1/5 to-chart-1/10 border-chart-1/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu hôm nay</CardTitle>
                    <div className="rounded-lg p-2 bg-chart-1/20 text-chart-1">
                        <Calendar className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingToday ? (
                        <Skeleton className="h-10 w-32" />
                    ) : (
                        <div className="space-y-1">
                            <div className="text-3xl font-bold text-chart-1">{formatCurrency(todayRevenue)}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{format(today, 'dd MMMM yyyy')}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* This Month Revenue */}
            <Card className="border-2 bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu tháng này</CardTitle>
                    <div className="rounded-lg p-2 bg-chart-2/20 text-chart-2">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingMonth ? (
                        <Skeleton className="h-10 w-32" />
                    ) : (
                        <div className="space-y-1">
                            <div className="text-3xl font-bold text-chart-2">{formatCurrency(monthRevenue)}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{format(startOfMonth, 'dd MMM')} - {format(endOfMonth, 'dd MMM yyyy')}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

