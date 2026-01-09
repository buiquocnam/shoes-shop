'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format';
import { ChartDataPoint } from '../types';

interface RevenueChartProps {
    data: ChartDataPoint[];
}

const chartConfig = {
    revenue: {
        label: 'Doanh thu',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function RevenueChart({ data }: RevenueChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Không có dữ liệu
            </div>
        );
    }

    const chartData = data.map((item) => ({
        month: item.label,
        revenue: item.value,
    }));

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                    top: 20,
                    right: 12,
                    left: 12,
                    bottom: 12,
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    tickFormatter={(value) => {
                        const parts = value.split('/');
                        return parts.length === 2 ? `${parts[0]}/${parts[1].slice(-2)}` : value;
                    }}
                    className="text-xs font-medium"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    tickFormatter={(value) => {
                        if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                        }
                        if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}k`;
                        }
                        return value.toString();
                    }}
                    className="text-xs font-medium"
                />
                <ChartTooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    content={
                        <ChartTooltipContent
                            indicator="dot"
                            formatter={(value) => (
                                <span className="font-bold text-chart-1">
                                    {formatCurrency(Number(value))}
                                </span>
                            )}
                            labelFormatter={(value) => `Tháng: ${value}`}
                        />
                    }
                />
                <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                />
            </BarChart>
        </ChartContainer>
    );
}
