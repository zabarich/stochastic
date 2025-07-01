'use client';

import { useState } from 'react';

interface MonteCarloFormProps {
  onSimulate: (numPaths: number) => void;
  isSimulating: boolean;
}

export default function MonteCarloForm({ onSimulate, isSimulating }: MonteCarloFormProps) {
  const [numPaths, setNumPaths] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(numPaths);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Monte Carlo Simulation</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Number of Paths
        </label>
        <input
          type="number"
          min="10"
          max="10000"
          step="10"
          value={numPaths}
          onChange={(e) => setNumPaths(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          disabled={isSimulating}
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Recommended: 100-1000 paths for good statistics
        </p>
      </div>

      <button
        type="submit"
        disabled={isSimulating}
        className={`w-full py-2 px-4 rounded-md transition duration-200 ${
          isSimulating
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSimulating ? 'Simulating...' : 'Run Monte Carlo Simulation'}
      </button>
    </form>
  );
}