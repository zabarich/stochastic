'use client';

import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { SDESolution, MonteCarloResult } from '@/lib/sde';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

interface InteractiveChartProps {
  solution?: SDESolution | null;
  monteCarloResult?: MonteCarloResult | null;
  showPaths?: number;
}

export default function InteractiveChart({ 
  solution, 
  monteCarloResult, 
  showPaths = 20 
}: InteractiveChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Prepare data
  let data: ChartData<'line'>;
  let timeLabels: number[];

  if (monteCarloResult) {
    // Monte Carlo visualization
    const { paths, statistics } = monteCarloResult;
    timeLabels = paths[0].time;
    
    const datasets = [];
    
    // Add individual paths
    for (let i = 0; i < Math.min(showPaths, paths.length); i++) {
      datasets.push({
        label: `Path ${i + 1}`,
        data: paths[i].values,
        borderColor: 'rgba(148, 163, 184, 0.3)',
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        pointRadius: 0,
        showLine: true,
        tension: 0,
      });
    }
    
    // Add percentile bands
    datasets.push({
      label: '95% Confidence Band',
      data: statistics.percentiles.p95,
      fill: '+1',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 0,
      pointRadius: 0,
      showLine: true,
      tension: 0,
    });
    
    datasets.push({
      label: '5% Confidence Band',
      data: statistics.percentiles.p5,
      fill: false,
      borderColor: 'rgba(59, 130, 246, 0.2)',
      backgroundColor: 'transparent',
      borderWidth: 0,
      pointRadius: 0,
      showLine: true,
      tension: 0,
    });
    
    // Add quartile lines
    datasets.push({
      label: '75th Percentile',
      data: statistics.percentiles.p75,
      borderColor: 'rgba(59, 130, 246, 0.5)',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      showLine: true,
      tension: 0,
    });
    
    datasets.push({
      label: '25th Percentile',
      data: statistics.percentiles.p25,
      borderColor: 'rgba(59, 130, 246, 0.5)',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      showLine: true,
      tension: 0,
    });
    
    // Add mean path
    datasets.push({
      label: 'Mean',
      data: statistics.mean,
      borderColor: 'rgba(220, 38, 38, 1)',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      showLine: true,
      tension: 0,
    });
    
    data = {
      labels: timeLabels,
      datasets,
    };
  } else if (solution) {
    // Single solution visualization
    timeLabels = solution.time;
    
    data = {
      labels: timeLabels,
      datasets: [
        {
          label: 'Solution',
          data: solution.values,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
          tension: 0,
        },
      ],
    };
  } else {
    return null;
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: monteCarloResult !== undefined,
        position: 'bottom' as const,
        labels: {
          filter: (item) => {
            // Only show important legend items
            return ['Mean', '95% Confidence Band', '75th Percentile', '25th Percentile'].includes(item.text);
          },
        },
      },
      title: {
        display: true,
        text: monteCarloResult ? 'Monte Carlo Simulation Results' : 'SDE Solution',
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(4);
            return `${label}: ${value}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(2);
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(2);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative" style={{ height: '400px' }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={resetZoom}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Reset Zoom
        </button>
        <p className="text-sm text-gray-600">
          Use mouse wheel to zoom, click and drag to pan
        </p>
      </div>
    </div>
  );
}