'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { useDashboard } from '../hooks';
import { RevenueChart } from './RevenueChart';
import { DateRangePicker } from './DateRangePicker';
import { RevenueSummary } from './RevenueSummary';
import { cn } from '@/lib/utils';

const STATS_CARDS = [
    {
        key: 'totalRevenue' as const,
        label: 'Tổng doanh thu',
        isCurrency: true,
    },
    {
        key: 'totalOrders' as const,
        label: 'Tổng đơn hàng',
    },
    {
        key: 'totalUsers' as const,
        label: 'Tổng người dùng',
    },
    {
        key: 'totalProducts' as const,
        label: 'Sản phẩm',
    },
];

export function DashboardContent() {
    const { dateRange, setDateRange, filteredOrders, chartData, stats, isLoading } = useDashboard();

    const formatOrderId = (id: string) => {
        return id.slice(0, 8).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Bảng điều khiển Admin
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Tổng quan thông tin cửa hàng
                        </p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-md border rounded-xl p-1 shadow-sm ring-1 ring-border">
                        <DateRangePicker onChange={setDateRange} defaultFrom={dateRange.from} defaultTo={dateRange.to} />
                    </div>
                </div>

                {/* Revenue Highlights */}
                <RevenueSummary />

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS_CARDS.map(({ key, label, isCurrency }) => {
                        const value = stats[key];
                        const displayValue = isLoading ? (
                            <Skeleton className="h-9 w-24" />
                        ) : isCurrency ? (
                            formatCurrency(value)
                        ) : (
                            value.toLocaleString()
                        );

                        return (
                            <Card key={key} className={cn("relative overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 ring-1")}>
                                <div className={cn("absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10")} />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tracking-tight">{displayValue}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Bar Chart */}
                    <Card className="lg:col-span-2 shadow-lg border-border overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Doanh thu theo thời gian
                                </CardTitle>
                                <CardDescription>Hiệu suất doanh thu hàng tháng của bạn</CardDescription>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-secondary border-border">
                                Dữ liệu thực tế
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-[350px] w-full" />
                            ) : (
                                <RevenueChart data={chartData} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Products or Activities could go here, for now Recent Orders */}
                    <Card className="shadow-lg border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold">Đơn hàng gần đây</CardTitle>
                            <CardDescription>Cập nhật mới nhất từ khách hàng</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 sm:px-6">
                            <div className="relative overflow-auto max-h-[400px]">
                                <Table>
                                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                        <TableRow>
                                            <TableHead className="font-bold text-xs">MÃ ĐƠN</TableHead>
                                            <TableHead className="text-right font-bold text-xs uppercase">TỔNG</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredOrders.length > 0 ? (
                                            filteredOrders.slice(0, 8).map((order) => (
                                                <TableRow key={order.id} className="hover:bg-accent transition-colors group">
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-mono font-bold text-foreground uppercase tracking-tighter">
                                                                #{formatOrderId(order.id)}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {format(new Date(order.createdAt), 'dd/MM, HH:mm')}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="font-bold text-chart-1">
                                                                {formatCurrency(order.totalMoney)}
                                                            </span>
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                                                {order.countBuy} SP
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-muted-foreground py-12">
                                                    Chưa có đơn hàng
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

