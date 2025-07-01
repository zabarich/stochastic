'use client';

import { SDESolution } from '@/lib/sde';

interface LineChartProps {
  solution: SDESolution;
}

export default function LineChart({ solution }: LineChartProps) {
  const { time, values } = solution;
  
  // Calculate chart dimensions and scaling
  const width = 800;
  const height = 400;
  const padding = 40;
  
  const xMin = Math.min(...time);
  const xMax = Math.max(...time);
  const yMin = Math.min(...values);
  const yMax = Math.max(...values);
  
  const xScale = (width - 2 * padding) / (xMax - xMin);
  const yScale = (height - 2 * padding) / (yMax - yMin);
  
  // Create SVG path
  const pathData = time
    .map((t, i) => {
      const x = padding + (t - xMin) * xScale;
      const y = height - padding - (values[i] - yMin) * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  
  // Create axis labels
  const xLabels = Array.from({ length: 5 }, (_, i) => {
    const value = xMin + (i / 4) * (xMax - xMin);
    const x = padding + (i / 4) * (width - 2 * padding);
    return { x, value: value.toFixed(2) };
  });
  
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const value = yMin + (i / 4) * (yMax - yMin);
    const y = height - padding - (i / 4) * (height - 2 * padding);
    return { y, value: value.toFixed(2) };
  });
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {xLabels.map(({ x }, i) => (
          <line
            key={`x-grid-${i}`}
            x1={x}
            y1={padding}
            x2={x}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {yLabels.map(({ y }, i) => (
          <line
            key={`y-grid-${i}`}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Path */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* X-axis labels */}
        {xLabels.map(({ x, value }, i) => (
          <text
            key={`x-label-${i}`}
            x={x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
          >
            {value}
          </text>
        ))}
        
        {/* Y-axis labels */}
        {yLabels.map(({ y, value }, i) => (
          <text
            key={`y-label-${i}`}
            x={padding - 10}
            y={y + 5}
            textAnchor="end"
            fontSize="12"
            fill="#374151"
          >
            {value}
          </text>
        ))}
        
        {/* Axis titles */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
        >
          Time
        </text>
        <text
          x={-height / 2}
          y={15}
          transform={`rotate(-90, 15, ${height / 2})`}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
        >
          Value
        </text>
      </svg>
    </div>
  );
}