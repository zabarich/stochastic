/**
 * Statistical analysis functions for Monte Carlo simulations
 */

import { SDESolution, MonteCarloResult } from './types';

/**
 * Calculate statistics across multiple simulation paths
 * @param paths - Array of solution paths
 * @returns Monte Carlo statistics
 */
export function calculateStatistics(paths: SDESolution[]): MonteCarloResult {
  if (paths.length === 0) {
    throw new Error('No paths provided for statistical analysis');
  }

  const numPaths = paths.length;
  const numSteps = paths[0].values.length;
  
  // Initialize arrays for statistics
  const mean = new Array(numSteps).fill(0);
  const variance = new Array(numSteps).fill(0);
  const p5 = new Array(numSteps);
  const p25 = new Array(numSteps);
  const p50 = new Array(numSteps);
  const p75 = new Array(numSteps);
  const p95 = new Array(numSteps);
  
  // Calculate statistics for each time step
  for (let t = 0; t < numSteps; t++) {
    const valuesAtTime = paths.map(path => path.values[t]);
    
    // Sort values for percentile calculation
    valuesAtTime.sort((a, b) => a - b);
    
    // Calculate mean
    mean[t] = valuesAtTime.reduce((sum, val) => sum + val, 0) / numPaths;
    
    // Calculate variance
    variance[t] = valuesAtTime.reduce((sum, val) => sum + Math.pow(val - mean[t], 2), 0) / numPaths;
    
    // Calculate percentiles
    p5[t] = getPercentile(valuesAtTime, 0.05);
    p25[t] = getPercentile(valuesAtTime, 0.25);
    p50[t] = getPercentile(valuesAtTime, 0.50);
    p75[t] = getPercentile(valuesAtTime, 0.75);
    p95[t] = getPercentile(valuesAtTime, 0.95);
  }
  
  return {
    paths,
    statistics: {
      mean,
      variance,
      percentiles: {
        p5,
        p25,
        p50,
        p75,
        p95
      }
    }
  };
}

/**
 * Calculate percentile from sorted array
 * @param sortedValues - Sorted array of values
 * @param p - Percentile (0-1)
 * @returns Percentile value
 */
function getPercentile(sortedValues: number[], p: number): number {
  const index = p * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  if (lower === upper) {
    return sortedValues[lower];
  }
  
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

/**
 * Calculate confidence intervals
 * @param mean - Mean values
 * @param variance - Variance values
 * @param numPaths - Number of simulation paths
 * @param confidence - Confidence level (default 0.95)
 * @returns Upper and lower bounds
 */
export function calculateConfidenceIntervals(
  mean: number[],
  variance: number[],
  numPaths: number,
  confidence: number = 0.95
): { lower: number[], upper: number[] } {
  // Z-score for 95% confidence
  const z = 1.96; // Normal approximation
  
  const lower = mean.map((m, i) => {
    const se = Math.sqrt(variance[i] / numPaths);
    return m - z * se;
  });
  
  const upper = mean.map((m, i) => {
    const se = Math.sqrt(variance[i] / numPaths);
    return m + z * se;
  });
  
  return { lower, upper };
}