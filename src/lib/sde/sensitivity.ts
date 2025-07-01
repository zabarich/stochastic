/**
 * Parameter sensitivity analysis for SDEs
 */

import { SDEParameters, SDESolution } from './types';
import { createSDE } from './models';
import { eulerMaruyama } from './euler-maruyama';

export interface SensitivityResult {
  parameter: string;
  values: number[];
  finalValues: number[];
  meanFinalValue: number;
  stdFinalValue: number;
}

export interface SensitivityAnalysis {
  baseCase: SDESolution;
  parameterName: string;
  results: SensitivityResult[];
}

/**
 * Perform sensitivity analysis on a single parameter
 * @param sdeType - Type of SDE
 * @param baseParams - Base parameters
 * @param paramName - Parameter to vary
 * @param values - Array of values to test
 * @returns Sensitivity analysis results
 */
export function analyzeSensitivity(
  sdeType: string,
  baseParams: SDEParameters,
  paramName: keyof SDEParameters,
  values: number[]
): SensitivityAnalysis {
  const results: SensitivityResult[] = [];
  
  // Generate base case
  const baseSDE = createSDE(sdeType, baseParams);
  const baseCase = eulerMaruyama(baseSDE);
  
  // Test each parameter value
  for (const value of values) {
    const testParams = { ...baseParams, [paramName]: value };
    const sde = createSDE(sdeType, testParams);
    
    // Run multiple simulations for each value
    const numRuns = 20;
    const finalValues: number[] = [];
    
    for (let i = 0; i < numRuns; i++) {
      const solution = eulerMaruyama(sde);
      finalValues.push(solution.values[solution.values.length - 1]);
    }
    
    // Calculate statistics
    const meanFinal = finalValues.reduce((a, b) => a + b, 0) / numRuns;
    const variance = finalValues.reduce((sum, val) => sum + Math.pow(val - meanFinal, 2), 0) / numRuns;
    const stdFinal = Math.sqrt(variance);
    
    results.push({
      parameter: paramName,
      values: [value],
      finalValues,
      meanFinalValue: meanFinal,
      stdFinalValue: stdFinal
    });
  }
  
  return {
    baseCase,
    parameterName: paramName,
    results
  };
}

/**
 * Perform parameter sweep for 2D sensitivity analysis
 * @param sdeType - Type of SDE
 * @param baseParams - Base parameters
 * @param param1 - First parameter to vary
 * @param values1 - Values for first parameter
 * @param param2 - Second parameter to vary
 * @param values2 - Values for second parameter
 * @returns 2D grid of final values
 */
export function parameterSweep2D(
  sdeType: string,
  baseParams: SDEParameters,
  param1: keyof SDEParameters,
  values1: number[],
  param2: keyof SDEParameters,
  values2: number[]
): { 
  values1: number[], 
  values2: number[], 
  grid: number[][],
  param1: string,
  param2: string
} {
  const grid: number[][] = [];
  
  for (let i = 0; i < values1.length; i++) {
    const row: number[] = [];
    
    for (let j = 0; j < values2.length; j++) {
      const testParams = {
        ...baseParams,
        [param1]: values1[i],
        [param2]: values2[j]
      };
      
      const sde = createSDE(sdeType, testParams);
      const solution = eulerMaruyama(sde);
      row.push(solution.values[solution.values.length - 1]);
    }
    
    grid.push(row);
  }
  
  return {
    values1,
    values2,
    grid,
    param1: param1 as string,
    param2: param2 as string
  };
}