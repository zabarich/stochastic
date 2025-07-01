/**
 * Preset templates for common SDE applications
 */

import { SDEParameters } from './types';

export interface SDEPreset {
  name: string;
  description: string;
  sdeType: 'gbm' | 'ou' | 'abm';
  parameters: SDEParameters;
  category: string;
}

export const presets: SDEPreset[] = [
  // Financial Models
  {
    name: 'Stock Price (Bull Market)',
    description: 'Geometric Brownian Motion modeling a bullish stock',
    sdeType: 'gbm',
    parameters: {
      mu: 0.15,      // 15% annual drift
      sigma: 0.25,   // 25% annual volatility
      X0: 100,       // Starting price $100
      T: 1,          // 1 year
      steps: 252     // Daily steps (trading days)
    },
    category: 'Finance'
  },
  {
    name: 'Stock Price (Bear Market)',
    description: 'Geometric Brownian Motion modeling a bearish stock',
    sdeType: 'gbm',
    parameters: {
      mu: -0.10,     // -10% annual drift
      sigma: 0.35,   // 35% annual volatility (higher in bear markets)
      X0: 100,
      T: 1,
      steps: 252
    },
    category: 'Finance'
  },
  {
    name: 'Cryptocurrency',
    description: 'High volatility asset modeling',
    sdeType: 'gbm',
    parameters: {
      mu: 0.50,      // 50% annual drift
      sigma: 0.80,   // 80% annual volatility
      X0: 1000,
      T: 0.25,       // 3 months
      steps: 90
    },
    category: 'Finance'
  },
  
  // Interest Rate Models
  {
    name: 'Interest Rate (Mean Reverting)',
    description: 'Vasicek model for interest rates',
    sdeType: 'ou',
    parameters: {
      mu: 0.05,      // Long-term mean of 5%
      sigma: 0.01,   // 1% volatility
      theta: 2.0,    // Mean reversion speed
      X0: 0.03,      // Starting at 3%
      T: 5,          // 5 years
      steps: 260     // Weekly steps
    },
    category: 'Interest Rates'
  },
  {
    name: 'Central Bank Rate',
    description: 'Slowly adjusting policy rate',
    sdeType: 'ou',
    parameters: {
      mu: 0.02,      // Target rate 2%
      sigma: 0.005,  // Low volatility
      theta: 0.5,    // Slow mean reversion
      X0: 0.025,     // Current rate 2.5%
      T: 3,
      steps: 156
    },
    category: 'Interest Rates'
  },
  
  // Physical Processes
  {
    name: 'Particle Diffusion',
    description: 'Brownian motion of a particle in fluid',
    sdeType: 'abm',
    parameters: {
      mu: 0,         // No drift
      sigma: 1,      // Unit diffusion
      X0: 0,         // Starting at origin
      T: 10,
      steps: 1000
    },
    category: 'Physics'
  },
  {
    name: 'Temperature Fluctuation',
    description: 'Room temperature around set point',
    sdeType: 'ou',
    parameters: {
      mu: 20,        // Target temperature 20°C
      sigma: 0.5,    // 0.5°C fluctuations
      theta: 1.0,    // Moderate mean reversion
      X0: 22,        // Starting at 22°C
      T: 24,         // 24 hours
      steps: 288     // 5-minute intervals
    },
    category: 'Physics'
  },
  
  // Biological Models
  {
    name: 'Population Growth',
    description: 'Stochastic population dynamics',
    sdeType: 'gbm',
    parameters: {
      mu: 0.02,      // 2% growth rate
      sigma: 0.10,   // 10% environmental variability
      X0: 1000,      // Initial population
      T: 50,         // 50 time units
      steps: 500
    },
    category: 'Biology'
  },
  {
    name: 'Drug Concentration',
    description: 'Drug elimination with random fluctuations',
    sdeType: 'ou',
    parameters: {
      mu: 0,         // Target concentration (eliminated)
      sigma: 2,      // Fluctuation magnitude
      theta: 0.3,    // Elimination rate
      X0: 100,       // Initial dose
      T: 24,         // 24 hours
      steps: 96      // 15-minute intervals
    },
    category: 'Biology'
  }
];

export function getPresetsByCategory(category: string): SDEPreset[] {
  return presets.filter(p => p.category === category);
}

export function getCategories(): string[] {
  const categories = new Set<string>();
  presets.forEach(p => categories.add(p.category));
  return Array.from(categories);
}