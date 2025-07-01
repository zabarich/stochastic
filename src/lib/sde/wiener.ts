/**
 * Wiener process (Brownian motion) generation
 */

/**
 * Generate a single Wiener process increment
 * @param dt - Time step
 * @returns Random increment following N(0, dt)
 */
export function generateWienerIncrement(dt: number): number {
  // Box-Muller transform for generating normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  // Scale by sqrt(dt) for Wiener process
  return z0 * Math.sqrt(dt);
}

/**
 * Generate a full Wiener process path
 * @param T - Total time
 * @param steps - Number of time steps
 * @returns Array of Wiener process values
 */
export function generateWienerPath(T: number, steps: number): number[] {
  const dt = T / steps;
  const path = new Array(steps + 1);
  path[0] = 0; // Wiener process starts at 0
  
  for (let i = 1; i <= steps; i++) {
    path[i] = path[i - 1] + generateWienerIncrement(dt);
  }
  
  return path;
}

/**
 * Generate multiple independent Wiener process paths
 * @param T - Total time
 * @param steps - Number of time steps
 * @param paths - Number of paths to generate
 * @returns 2D array of Wiener process paths
 */
export function generateMultipleWienerPaths(
  T: number,
  steps: number,
  paths: number
): number[][] {
  const result: number[][] = [];
  
  for (let i = 0; i < paths; i++) {
    result.push(generateWienerPath(T, steps));
  }
  
  return result;
}