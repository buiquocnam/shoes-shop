import React from 'react';

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  width?: number;
  height?: number;
};

// Simple, dependency-free SVG area + line chart.
export default function RevenueChart({ data, width = 600, height = 200 }: Props) {
  if (!data || data.length === 0) return <div>No data</div>;

  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const x = (i: number) => padding + (i / (data.length - 1)) * innerW;
  const y = (val: number) => padding + innerH - ((val - min) / range) * innerH;

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');

  // Build path for the line
  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`)
    .join(' ');

  // Area path (line + bottom back to first)
  const areaPath = `${linePath} L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`;

  // Simple ticks for y-axis (3 ticks)
  const ticks = [0, 0.5, 1].map((t) => min + t * range);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm font-medium mb-2">Doanh thu theo tháng</h3>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid / ticks */}
        {ticks.map((t, i) => {
          const yy = y(t);
          return (
            <g key={i}>
              <line x1={padding} x2={padding + innerW} y1={yy} y2={yy} stroke="#e6e7ee" strokeWidth={1} />
              <text x={4} y={yy} fontSize={10} fill="#6b7280" dominantBaseline="middle">{Math.round(t).toLocaleString()}</text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#grad)" stroke="none" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {data.map((d, i) => (
          <circle key={d.label} cx={x(i)} cy={y(d.value)} r={3.5} fill="#4F46E5" />
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={padding + innerH + 14} fontSize={10} fill="#6b7280" textAnchor="middle">
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
