'use client';

import { MonteCarloResult } from '@/lib/sde';

interface StatisticsDisplayProps {
  result: MonteCarloResult;
}

export default function StatisticsDisplay({ result }: StatisticsDisplayProps) {
  const { statistics } = result;
  const lastIndex = statistics.mean.length - 1;
  
  // Get final values
  const finalMean = statistics.mean[lastIndex];
  const finalStdDev = Math.sqrt(statistics.variance[lastIndex]);
  const finalP5 = statistics.percentiles.p5[lastIndex];
  const finalP95 = statistics.percentiles.p95[lastIndex];
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Statistics Summary</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Number of Paths</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{result.paths.length}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Time Steps</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{statistics.mean.length - 1}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Final Mean</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{finalMean.toFixed(4)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Final Std Dev</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{finalStdDev.toFixed(4)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">5th Percentile</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{finalP5.toFixed(4)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">95th Percentile</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{finalP95.toFixed(4)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Percentiles at Final Time</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">5%:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{finalP5.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">25%:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{statistics.percentiles.p25[lastIndex].toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">50% (Median):</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{statistics.percentiles.p50[lastIndex].toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">75%:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{statistics.percentiles.p75[lastIndex].toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">95%:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{finalP95.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}