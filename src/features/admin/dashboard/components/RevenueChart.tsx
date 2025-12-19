'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
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
        <ChartContainer config={chartConfig} className="h-[300px] w-full [&>div]:!aspect-auto">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                }}
            >
                <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        const parts = value.split('/');
                        return parts.length === 2 ? `${parts[0]}/${parts[1].slice(-2)}` : value;
                    }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        if (value >= 1000) {
                            return `${(value / 1000).toFixed(1)}k`;
                        }
                        return value.toString();
                    }}
                />
                <ChartTooltip
                    cursor={true}
                    content={
                        <ChartTooltipContent
                            indicator="dot"
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(value) => `Tháng: ${value}`}
                        />
                    }
                />
                <Area
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    fill="url(#fillRevenue)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-revenue)', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </AreaChart>
        </ChartContainer>
    );
}
