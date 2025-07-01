/**
 * Parallel computation utilities for Monte Carlo simulations
 */

import { SDEParameters, SDESolution } from './types';
import { createSDE } from './models';
import { eulerMaruyama } from './euler-maruyama';

/**
 * Run Monte Carlo simulation with parallel computation
 * @param sdeType - Type of SDE
 * @param params - SDE parameters
 * @param numPaths - Total number of paths to simulate
 * @param onProgress - Progress callback
 * @returns Array of solution paths
 */
export async function simulateMonteCarloParallel(
  sdeType: string,
  params: SDEParameters,
  numPaths: number,
  onProgress?: (progress: number) => void
): Promise<SDESolution[]> {
  // For now, use simple sequential computation
  // Web Workers require additional webpack configuration in Next.js
  const paths: SDESolution[] = [];
  const sde = createSDE(sdeType, params);
  
  for (let i = 0; i < numPaths; i++) {
    paths.push(eulerMaruyama(sde));
    
    // Report progress
    if (onProgress && i % 10 === 0) {
      onProgress((i + 1) / numPaths);
    }
  }
  
  if (onProgress) {
    onProgress(1);
  }
  
  return paths;
}

/**
 * Batch process paths for better performance
 * @param sdeType - Type of SDE
 * @param params - SDE parameters
 * @param numPaths - Total number of paths
 * @param batchSize - Size of each batch
 * @returns Array of solution paths
 */
export function simulateMonteCarloBatch(
  sdeType: string,
  params: SDEParameters,
  numPaths: number,
  batchSize: number = 100
): SDESolution[] {
  const paths: SDESolution[] = [];
  const sde = createSDE(sdeType, params);
  
  const numBatches = Math.ceil(numPaths / batchSize);
  
  for (let batch = 0; batch < numBatches; batch++) {
    const batchPaths = Math.min(batchSize, numPaths - batch * batchSize);
    
    for (let i = 0; i < batchPaths; i++) {
      paths.push(eulerMaruyama(sde));
    }
  }
  
  return paths;
}