'use client';

import { SDESolution, MonteCarloResult } from '@/lib/sde';

interface ExportOptionsProps {
  solution?: SDESolution | null;
  monteCarloResult?: MonteCarloResult | null;
  chartRef?: React.RefObject<HTMLDivElement>;
}

export default function ExportOptions({ 
  solution, 
  monteCarloResult,
  chartRef 
}: ExportOptionsProps) {
  
  const exportToCSV = () => {
    if (!solution && !monteCarloResult) return;
    
    let csv = '';
    
    if (monteCarloResult) {
      // Export Monte Carlo results
      const { paths, statistics } = monteCarloResult;
      const time = paths[0].time;
      
      // Header
      csv = 'Time,Mean,Std Dev,P5,P25,P50,P75,P95';
      for (let i = 0; i < Math.min(10, paths.length); i++) {
        csv += `,Path${i + 1}`;
      }
      csv += '\n';
      
      // Data rows
      for (let t = 0; t < time.length; t++) {
        csv += `${time[t].toFixed(4)}`;
        csv += `,${statistics.mean[t].toFixed(6)}`;
        csv += `,${Math.sqrt(statistics.variance[t]).toFixed(6)}`;
        csv += `,${statistics.percentiles.p5[t].toFixed(6)}`;
        csv += `,${statistics.percentiles.p25[t].toFixed(6)}`;
        csv += `,${statistics.percentiles.p50[t].toFixed(6)}`;
        csv += `,${statistics.percentiles.p75[t].toFixed(6)}`;
        csv += `,${statistics.percentiles.p95[t].toFixed(6)}`;
        
        for (let i = 0; i < Math.min(10, paths.length); i++) {
          csv += `,${paths[i].values[t].toFixed(6)}`;
        }
        csv += '\n';
      }
    } else if (solution) {
      // Export single solution
      csv = 'Time,Value\n';
      for (let i = 0; i < solution.time.length; i++) {
        csv += `${solution.time[i].toFixed(4)},${solution.values[i].toFixed(6)}\n`;
      }
    }
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sde-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const exportToJSON = () => {
    if (!solution && !monteCarloResult) return;
    
    const data = monteCarloResult || { solution };
    const json = JSON.stringify(data, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sde-results-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const exportChartAsPNG = async () => {
    if (!chartRef?.current) return;
    
    try {
      // Find the canvas element within the chart container
      const canvas = chartRef.current.querySelector('canvas');
      if (!canvas) {
        alert('No chart found to export');
        return;
      }
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sde-chart-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Error exporting chart as PNG');
    }
  };
  
  const exportStatisticsSummary = () => {
    if (!monteCarloResult) return;
    
    const { statistics, paths } = monteCarloResult;
    const lastIdx = statistics.mean.length - 1;
    
    const summary = {
      metadata: {
        numPaths: paths.length,
        timeSteps: statistics.mean.length,
        parameters: paths[0].parameters,
        exportDate: new Date().toISOString()
      },
      finalStatistics: {
        mean: statistics.mean[lastIdx],
        standardDeviation: Math.sqrt(statistics.variance[lastIdx]),
        percentiles: {
          p5: statistics.percentiles.p5[lastIdx],
          p25: statistics.percentiles.p25[lastIdx],
          p50: statistics.percentiles.p50[lastIdx],
          p75: statistics.percentiles.p75[lastIdx],
          p95: statistics.percentiles.p95[lastIdx]
        }
      },
      timeSeriesStatistics: {
        mean: statistics.mean,
        variance: statistics.variance,
        percentiles: statistics.percentiles
      }
    };
    
    const json = JSON.stringify(summary, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sde-statistics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Export Options</h3>
      
      <div className="space-y-3">
        <button
          onClick={exportToCSV}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          disabled={!solution && !monteCarloResult}
        >
          Export Data as CSV
        </button>
        
        <button
          onClick={exportToJSON}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          disabled={!solution && !monteCarloResult}
        >
          Export Data as JSON
        </button>
        
        {monteCarloResult && (
          <button
            onClick={exportStatisticsSummary}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            Export Statistics Summary
          </button>
        )}
        
        <button
          onClick={exportChartAsPNG}
          className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
        >
          Export Chart as PNG
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1 text-gray-700 dark:text-gray-300">Export formats:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>CSV: Time series data in spreadsheet format</li>
          <li>JSON: Complete data structure for analysis</li>
          {monteCarloResult && <li>Statistics: Summary of statistical results</li>}
          <li>PNG: High-resolution chart image</li>
        </ul>
      </div>
    </div>
  );
}