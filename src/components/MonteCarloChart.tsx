'use client';

import { MonteCarloResult } from '@/lib/sde';

interface MonteCarloChartProps {
  result: MonteCarloResult;
  showPaths?: number;
}

export default function MonteCarloChart({ result, showPaths = 20 }: MonteCarloChartProps) {
  const { paths, statistics } = result;
  const time = paths[0].time;
  
  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = 40;
  
  // Calculate scales
  const xMin = Math.min(...time);
  const xMax = Math.max(...time);
  
  // Find y range from all paths and statistics
  let yMin = Infinity;
  let yMax = -Infinity;
  
  paths.slice(0, showPaths).forEach(path => {
    yMin = Math.min(yMin, ...path.values);
    yMax = Math.max(yMax, ...path.values);
  });
  
  yMin = Math.min(yMin, ...statistics.percentiles.p5);
  yMax = Math.max(yMax, ...statistics.percentiles.p95);
  
  const xScale = (width - 2 * padding) / (xMax - xMin);
  const yScale = (height - 2 * padding) / (yMax - yMin);
  
  // Helper function to create path
  const createPath = (values: number[]) => {
    return time
      .map((t, i) => {
        const x = padding + (t - xMin) * xScale;
        const y = height - padding - (values[i] - yMin) * yScale;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };
  
  // Create confidence band path
  const confidenceBand = time
    .map((t, i) => {
      const x = padding + (t - xMin) * xScale;
      const y95 = height - padding - (statistics.percentiles.p95[i] - yMin) * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y95}`;
    })
    .join(' ') +
    ' ' +
    time
      .slice()
      .reverse()
      .map((t, i) => {
        const idx = time.length - 1 - i;
        const x = padding + (t - xMin) * xScale;
        const y5 = height - padding - (statistics.percentiles.p5[idx] - yMin) * yScale;
        return `L ${x} ${y5}`;
      })
      .join(' ') +
    ' Z';
  
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
        
        {/* Confidence band */}
        <path
          d={confidenceBand}
          fill="#3b82f6"
          fillOpacity="0.1"
          stroke="none"
        />
        
        {/* Individual paths */}
        {paths.slice(0, showPaths).map((path, i) => (
          <path
            key={`path-${i}`}
            d={createPath(path.values)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Percentile lines */}
        <path
          d={createPath(statistics.percentiles.p25)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.7"
        />
        <path
          d={createPath(statistics.percentiles.p75)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.7"
        />
        
        {/* Mean path */}
        <path
          d={createPath(statistics.mean)}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
        />
        
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
        
        {/* Labels */}
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
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-red-600 mr-2"></div>
          <span>Mean</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-blue-600 mr-2" style={{ borderTop: '1px dashed' }}></div>
          <span>25th/75th Percentile</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 opacity-10 mr-2"></div>
          <span>5th/95th Percentile</span>
        </div>
      </div>
    </div>
  );
}