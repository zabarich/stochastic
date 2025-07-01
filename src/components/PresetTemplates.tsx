'use client';

import { useState } from 'react';
import { presets, getCategories, SDEPreset } from '@/lib/sde/presets';
import { SDEParameters } from '@/lib/sde';

interface PresetTemplatesProps {
  onSelectPreset: (params: SDEParameters, sdeType: string) => void;
}

export default function PresetTemplates({ onSelectPreset }: PresetTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Finance');
  const categories = getCategories();
  
  const filteredPresets = presets.filter(p => p.category === selectedCategory);
  
  const handlePresetSelect = (preset: SDEPreset) => {
    onSelectPreset(preset.parameters, preset.sdeType);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Preset Templates</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-sm transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredPresets.map((preset, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition cursor-pointer bg-white dark:bg-gray-700"
            onClick={() => handlePresetSelect(preset)}
          >
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{preset.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{preset.description}</p>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>Type: {preset.sdeType.toUpperCase()}</div>
              <div className="flex flex-wrap gap-2">
                <span>μ={preset.parameters.mu}</span>
                <span>σ={preset.parameters.sigma}</span>
                {preset.parameters.theta && <span>θ={preset.parameters.theta}</span>}
                <span>X₀={preset.parameters.X0}</span>
                <span>T={preset.parameters.T}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Click on a preset to load its parameters into the form.</p>
      </div>
    </div>
  );
}