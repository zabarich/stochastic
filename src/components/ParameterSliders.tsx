'use client';

import { SDEParameters } from '@/lib/sde';

interface ParameterSlidersProps {
  params: SDEParameters;
  sdeType: string;
  onChange: (params: SDEParameters) => void;
  onUpdate: () => void;
}

export default function ParameterSliders({ 
  params, 
  sdeType, 
  onChange, 
  onUpdate 
}: ParameterSlidersProps) {
  const handleChange = (field: keyof SDEParameters, value: number) => {
    onChange({
      ...params,
      [field]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Parameter Controls</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drift (μ): {params.mu.toFixed(2)}
            </label>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={params.mu}
            onChange={(e) => handleChange('mu', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Volatility (σ): {params.sigma.toFixed(2)}
            </label>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.sigma}
            onChange={(e) => handleChange('sigma', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {sdeType === 'ou' && (
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mean Reversion (θ): {params.theta?.toFixed(2)}
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={params.theta || 1}
              onChange={(e) => handleChange('theta', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Value (X₀): {params.X0.toFixed(0)}
            </label>
          </div>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={params.X0}
            onChange={(e) => handleChange('X0', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Horizon (T): {params.T.toFixed(1)}
            </label>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={params.T}
            onChange={(e) => handleChange('T', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={onUpdate}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Update Visualization
      </button>
    </div>
  );
}

// Add custom styles for range sliders
const styles = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    cursor: pointer;
    border-radius: 50%;
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #3b82f6;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}