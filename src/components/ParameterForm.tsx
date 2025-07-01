'use client';

import { useState } from 'react';
import { SDEParameters } from '@/lib/sde';

interface ParameterFormProps {
  onSubmit: (params: SDEParameters, sdeType: string) => void;
}

export default function ParameterForm({ onSubmit }: ParameterFormProps) {
  const [sdeType, setSdeType] = useState('gbm');
  const [params, setParams] = useState<SDEParameters>({
    mu: 0.1,
    sigma: 0.2,
    theta: 1.0,
    X0: 100,
    T: 1,
    steps: 252
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params, sdeType);
  };

  const handleChange = (field: keyof SDEParameters, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setParams(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SDE Type
        </label>
        <select
          value={sdeType}
          onChange={(e) => setSdeType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="gbm">Geometric Brownian Motion</option>
          <option value="ou">Ornstein-Uhlenbeck Process</option>
          <option value="abm">Arithmetic Brownian Motion</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Drift (μ)
          </label>
          <input
            type="number"
            step="0.01"
            value={params.mu}
            onChange={(e) => handleChange('mu', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Volatility (σ)
          </label>
          <input
            type="number"
            step="0.01"
            value={params.sigma}
            onChange={(e) => handleChange('sigma', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {sdeType === 'ou' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mean Reversion (θ)
            </label>
            <input
              type="number"
              step="0.1"
              value={params.theta}
              onChange={(e) => handleChange('theta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Initial Value (X₀)
          </label>
          <input
            type="number"
            step="1"
            value={params.X0}
            onChange={(e) => handleChange('X0', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Horizon (T)
          </label>
          <input
            type="number"
            step="0.1"
            value={params.T}
            onChange={(e) => handleChange('T', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Steps
          </label>
          <input
            type="number"
            step="1"
            value={params.steps}
            onChange={(e) => handleChange('steps', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Generate Solution
      </button>
    </form>
  );
}