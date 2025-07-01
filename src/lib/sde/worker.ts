/**
 * Web Worker for parallel SDE path computation
 */

import { SDEParameters } from './types';
import { createSDE } from './models';
import { eulerMaruyama } from './euler-maruyama';

// Worker message types
interface WorkerRequest {
  type: 'compute';
  sdeType: string;
  params: SDEParameters;
  numPaths: number;
  startIndex: number;
}

interface WorkerResponse {
  type: 'result';
  paths: any[];
  startIndex: number;
}

// Listen for messages from main thread
self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const { type, sdeType, params, numPaths, startIndex } = event.data;
  
  if (type === 'compute') {
    try {
      const paths = [];
      const sde = createSDE(sdeType, params);
      
      for (let i = 0; i < numPaths; i++) {
        const solution = eulerMaruyama(sde);
        paths.push(solution);
      }
      
      // Send results back to main thread
      const response: WorkerResponse = {
        type: 'result',
        paths,
        startIndex
      };
      
      self.postMessage(response);
    } catch (error) {
      self.postMessage({ 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
});