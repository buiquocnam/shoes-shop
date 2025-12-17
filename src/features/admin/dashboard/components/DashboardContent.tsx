'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { useDashboard } from '../hooks';
import { RevenueChart } from './RevenueChart';
import { DateRangePicker } from './DateRangePicker';
import { RevenueSummary } from './RevenueSummary';

const STATS_CARDS = [
    {
        key: 'totalRevenue' as const,
        label: 'Total Revenue',
        isCurrency: true,
        icon: DollarSign,
        color: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    },
    {
        key: 'totalOrders' as const,
        label: 'Total Orders',
        icon: ShoppingBag,
        color: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    },
    {
        key: 'totalUsers' as const,
        label: 'Total Users',
        icon: Users,
        color: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    },
    {
        key: 'totalProducts' as const,
        label: 'Products',
        icon: Package,
        color: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    },
];

export function DashboardContent() {
    const { dateRange, setDateRange, filteredOrders, chartData, stats, topProducts, isLoading } = useDashboard();

    const formatOrderId = (id: string) => {
        return id.slice(0, 8).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Overview of your store performance
                        </p>
                    </div>
                    <DateRangePicker onChange={setDateRange} defaultFrom={dateRange.from} defaultTo={dateRange.to} />
                </div>

                {/* Revenue Summary - Today & This Month */}
                <RevenueSummary />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS_CARDS.map(({ key, label, isCurrency, icon: Icon, color }) => {
                        const value = stats[key];
                        const displayValue = isLoading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : isCurrency ? (
                            formatCurrency(value)
                        ) : (
                            value.toLocaleString()
                        );
                        return (
                            <Card key={key} className="transition-all hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardDescription className="font-medium">{label}</CardDescription>
                                    <div className={`rounded-lg p-2 ${color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tight">{displayValue}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle className="text-xl">Revenue Overview</CardTitle>
                            <CardDescription className="mt-1">Monthly revenue breakdown</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-[300px] w-full" />
                        ) : (
                            <RevenueChart data={chartData} />
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card >
                    <CardHeader>
                        <CardTitle className="text-xl">Recent Orders</CardTitle>
                        <CardDescription>A list of recent orders from your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-mono font-medium text-sm">
                                                {formatOrderId(order.id)}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                {order.userId.slice(0, 8)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-chart-1">
                                                {formatCurrency(order.totalMoney)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="secondary" className="text-xs font-medium">
                                                    {order.countBuy}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

