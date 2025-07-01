/**
 * Euler-Maruyama numerical method for solving SDEs
 */

import { SDE, SDESolution } from './types';
import { generateWienerIncrement } from './wiener';

/**
 * Solve an SDE using the Euler-Maruyama method
 * @param sde - The SDE to solve
 * @param wienerPath - Pre-generated Wiener process increments (optional)
 * @returns Solution path
 */
export function eulerMaruyama(
  sde: SDE,
  wienerIncrements?: number[]
): SDESolution {
  const { X0, T, steps } = sde['params'];
  const dt = T / steps;
  
  const time = new Array(steps + 1);
  const values = new Array(steps + 1);
  
  // Initialize
  time[0] = 0;
  values[0] = X0;
  
  // Generate Wiener increments if not provided
  const dW = wienerIncrements || Array(steps).fill(0).map(() => generateWienerIncrement(dt));
  
  // Euler-Maruyama iteration
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    const X = values[i];
    
    // X_{t+dt} = X_t + μ(X_t, t) * dt + σ(X_t, t) * dW_t
    values[i + 1] = X + sde.drift(X, t) * dt + sde.diffusion(X, t) * dW[i];
    time[i + 1] = (i + 1) * dt;
  }
  
  return {
    time,
    values,
    parameters: sde['params']
  };
}

/**
 * Run multiple simulations of an SDE
 * @param sde - The SDE to solve
 * @param numPaths - Number of paths to simulate
 * @returns Array of solution paths
 */
export function simulateMultiplePaths(
  sde: SDE,
  numPaths: number
): SDESolution[] {
  const paths: SDESolution[] = [];
  
  for (let i = 0; i < numPaths; i++) {
    paths.push(eulerMaruyama(sde));
  }
  
  return paths;
}