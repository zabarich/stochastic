/**
 * Type definitions for SDE solver
 */

export interface SDEParameters {
  mu: number;      // Drift coefficient
  sigma: number;   // Volatility/diffusion coefficient
  theta?: number;  // Mean reversion rate (for Ornstein-Uhlenbeck)
  X0: number;      // Initial value
  T: number;       // Time horizon
  steps: number;   // Number of time steps
}

export interface SDESolution {
  time: number[];
  values: number[];
  parameters: SDEParameters;
}

export interface MonteCarloResult {
  paths: SDESolution[];
  statistics: {
    mean: number[];
    variance: number[];
    percentiles: {
      p5: number[];
      p25: number[];
      p50: number[];
      p75: number[];
      p95: number[];
    };
  };
}

export abstract class SDE {
  protected params: SDEParameters;

  constructor(params: SDEParameters) {
    this.params = params;
  }

  /**
   * Drift function μ(X_t, t)
   */
  abstract drift(X: number, t: number): number;

  /**
   * Diffusion function σ(X_t, t)
   */
  abstract diffusion(X: number, t: number): number;

  /**
   * Get equation name for display
   */
  abstract getName(): string;

  /**
   * Get LaTeX representation of the equation
   */
  abstract getLatex(): string;
}