/**
 * Specific SDE model implementations
 */

import { SDE, SDEParameters } from './types';

/**
 * Geometric Brownian Motion
 * dX = μX dt + σX dW
 */
export class GeometricBrownianMotion extends SDE {
  drift(X: number, t: number): number {
    return this.params.mu * X;
  }

  diffusion(X: number, t: number): number {
    return this.params.sigma * X;
  }

  getName(): string {
    return 'Geometric Brownian Motion';
  }

  getLatex(): string {
    return 'dX_t = \\mu X_t dt + \\sigma X_t dW_t';
  }
}

/**
 * Ornstein-Uhlenbeck Process
 * dX = θ(μ - X) dt + σ dW
 */
export class OrnsteinUhlenbeckProcess extends SDE {
  drift(X: number, t: number): number {
    const theta = this.params.theta || 1;
    return theta * (this.params.mu - X);
  }

  diffusion(X: number, t: number): number {
    return this.params.sigma;
  }

  getName(): string {
    return 'Ornstein-Uhlenbeck Process';
  }

  getLatex(): string {
    return 'dX_t = \\theta(\\mu - X_t) dt + \\sigma dW_t';
  }
}

/**
 * Arithmetic Brownian Motion
 * dX = μ dt + σ dW
 */
export class ArithmeticBrownianMotion extends SDE {
  drift(X: number, t: number): number {
    return this.params.mu;
  }

  diffusion(X: number, t: number): number {
    return this.params.sigma;
  }

  getName(): string {
    return 'Arithmetic Brownian Motion';
  }

  getLatex(): string {
    return 'dX_t = \\mu dt + \\sigma dW_t';
  }
}

/**
 * Factory function to create SDE instances
 */
export function createSDE(type: string, params: SDEParameters): SDE {
  switch (type) {
    case 'gbm':
      return new GeometricBrownianMotion(params);
    case 'ou':
      return new OrnsteinUhlenbeckProcess(params);
    case 'abm':
      return new ArithmeticBrownianMotion(params);
    default:
      throw new Error(`Unknown SDE type: ${type}`);
  }
}