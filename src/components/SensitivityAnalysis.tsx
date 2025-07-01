'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { SDEParameters, analyzeSensitivity, SensitivityAnalysis } from '@/lib/sde';

interface SensitivityAnalysisProps {
  sdeType: string;
  baseParams: SDEParameters;
}

export default function SensitivityAnalysisComponent({ 
  sdeType, 
  baseParams 
}: SensitivityAnalysisProps) {
  const [selectedParam, setSelectedParam] = useState<keyof SDEParameters>('mu');
  const [numSteps, setNumSteps] = useState(10);
  const [analysis, setAnalysis] = useState<SensitivityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const parameterOptions = [
    { value: 'mu', label: 'Drift (μ)' },
    { value: 'sigma', label: 'Volatility (σ)' },
    ...(sdeType === 'ou' ? [{ value: 'theta', label: 'Mean Reversion (θ)' }] : []),
    { value: 'X0', label: 'Initial Value (X₀)' }
  ];

  const generateParameterRange = (param: keyof SDEParameters): number[] => {
    const baseValue = baseParams[param] as number;
    const steps: number[] = [];
    
    // Generate range around base value
    const minMultiplier = param === 'sigma' ? 0.1 : 0.5;
    const maxMultiplier = param === 'sigma' ? 3 : 2;
    
    for (let i = 0; i < numSteps; i++) {
      const multiplier = minMultiplier + (maxMultiplier - minMultiplier) * (i / (numSteps - 1));
      steps.push(baseValue * multiplier);
    }
    
    return steps;
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    try {
      const paramValues = generateParameterRange(selectedParam);
      const result = analyzeSensitivity(sdeType, baseParams, selectedParam, paramValues);
      setAnalysis(result);
    } catch (error) {
      console.error('Sensitivity analysis error:', error);
      alert('Error running sensitivity analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prepare chart data
  const chartData = analysis ? {
    labels: analysis.results.map(r => r.values[0].toFixed(3)),
    datasets: [
      {
        label: 'Mean Final Value',
        data: analysis.results.map(r => r.meanFinalValue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'transparent',
        tension: 0.1,
      },
      {
        label: 'Mean + Std Dev',
        data: analysis.results.map(r => r.meanFinalValue + r.stdFinalValue),
        borderColor: 'rgba(59, 130, 246, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'Mean - Std Dev',
        data: analysis.results.map(r => r.meanFinalValue - r.stdFinalValue),
        borderColor: 'rgba(59, 130, 246, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.1,
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Sensitivity to ${parameterOptions.find(p => p.value === selectedParam)?.label}`
      },
      legend: {
        position: 'bottom' as const,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Parameter Value'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Final Value'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Parameter Sensitivity Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parameter to Analyze
          </label>
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value as keyof SDEParameters)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {parameterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number of Steps
          </label>
          <input
            type="number"
            min="5"
            max="20"
            value={numSteps}
            onChange={(e) => setNumSteps(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <button
        onClick={runAnalysis}
        disabled={isAnalyzing}
        className={`w-full py-2 px-4 rounded-md transition duration-200 ${
          isAnalyzing
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : 'Run Sensitivity Analysis'}
      </button>
      
      {chartData && (
        <div className="mt-6">
          <Line data={chartData} options={chartOptions} />
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              This chart shows how the final value changes as {parameterOptions.find(p => p.value === selectedParam)?.label} varies.
              The solid line shows the mean, and dashed lines show ±1 standard deviation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}