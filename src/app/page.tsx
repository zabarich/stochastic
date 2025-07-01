'use client';

import { useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ParameterForm from '@/components/ParameterForm';
import MonteCarloForm from '@/components/MonteCarloForm';
import StatisticsDisplay from '@/components/StatisticsDisplay';
import ParameterSliders from '@/components/ParameterSliders';
import ExportOptions from '@/components/ExportOptions';
import PresetTemplates from '@/components/PresetTemplates';
import SafeEquationDisplay from '@/components/SafeEquationDisplay';
import DarkModeToggle from '@/components/DarkModeToggle';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileLayout from '@/components/MobileLayout';
import { ChartSkeleton, StatisticsSkeleton, LoadingSpinner } from '@/components/LoadingStates';
import { 
  SDEParameters, 
  SDESolution, 
  MonteCarloResult,
  createSDE, 
  eulerMaruyama,
  simulateMonteCarloParallel,
  calculateStatistics
} from '@/lib/sde';

// Lazy load heavy components
const InteractiveChart = dynamic(() => import('@/components/InteractiveChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

const SensitivityAnalysis = dynamic(() => import('@/components/SensitivityAnalysis'), {
  loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />,
  ssr: false
});

export default function Home() {
  const [solution, setSolution] = useState<SDESolution | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [sdeInfo, setSdeInfo] = useState<{ name: string; latex: string } | null>(null);
  const [currentParams, setCurrentParams] = useState<SDEParameters | null>(null);
  const [currentSdeType, setCurrentSdeType] = useState<string>('gbm');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [showSliders, setShowSliders] = useState(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'presets'>('parameters');
  
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (params: SDEParameters, sdeType: string) => {
    try {
      // Validate parameters
      if (isNaN(params.mu) || isNaN(params.sigma) || isNaN(params.X0) || 
          isNaN(params.T) || isNaN(params.steps) || params.steps <= 0 || params.T <= 0) {
        alert('Please enter valid numerical parameters');
        return;
      }
      
      // For Ornstein-Uhlenbeck, check theta
      if (sdeType === 'ou' && (isNaN(params.theta!) || params.theta! <= 0)) {
        alert('Please enter a valid positive value for theta (θ)');
        return;
      }
      
      const sde = createSDE(sdeType, params);
      const result = eulerMaruyama(sde);
      
      // Check if result is valid
      if (!result || !result.values || result.values.some(v => !isFinite(v))) {
        throw new Error('Numerical instability detected in solution');
      }
      
      setSolution(result);
      setSdeInfo({
        name: sde.getName(),
        latex: sde.getLatex()
      });
      setCurrentParams(params);
      setCurrentSdeType(sdeType);
      setMonteCarloResult(null);
      setShowSliders(true);
    } catch (error) {
      console.error('Error solving SDE:', error);
      alert(`Error solving SDE: ${error instanceof Error ? error.message : 'Please check your parameters'}`);
    }
  };

  const handleMonteCarloSimulation = async (numPaths: number) => {
    if (!currentParams || !currentSdeType) {
      alert('Please generate a single solution first');
      return;
    }

    setIsSimulating(true);
    setSimulationProgress(0);

    try {
      const paths = await simulateMonteCarloParallel(
        currentSdeType,
        currentParams,
        numPaths,
        (progress) => setSimulationProgress(progress)
      );

      const statistics = calculateStatistics(paths);
      setMonteCarloResult(statistics);
    } catch (error) {
      console.error('Error in Monte Carlo simulation:', error);
      alert('Error running Monte Carlo simulation');
    } finally {
      setIsSimulating(false);
      setSimulationProgress(0);
    }
  };

  const handleParameterChange = (params: SDEParameters) => {
    setCurrentParams(params);
  };

  const handleUpdateVisualization = () => {
    if (currentParams && currentSdeType) {
      if (monteCarloResult) {
        handleMonteCarloSimulation(monteCarloResult.paths.length);
      } else {
        handleSubmit(currentParams, currentSdeType);
      }
    }
  };

  const handlePresetSelect = (params: SDEParameters, sdeType: string) => {
    handleSubmit(params, sdeType);
    setActiveTab('parameters');
  };

  const sidebarContent = (
    <>
      <div className="animate-fade-in">
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`flex-1 py-2 px-4 rounded-t-lg font-semibold transition ${
              activeTab === 'parameters'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Parameters
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-4 rounded-t-lg font-semibold transition ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Presets
          </button>
        </div>
        
        {activeTab === 'parameters' ? (
          <ParameterForm onSubmit={handleSubmit} />
        ) : (
          <PresetTemplates onSelectPreset={handlePresetSelect} />
        )}
      </div>
      
      {solution && showSliders && currentParams && (
        <div className="animate-slide-up">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Real-time Controls</h2>
          <ParameterSliders
            params={currentParams}
            sdeType={currentSdeType}
            onChange={handleParameterChange}
            onUpdate={handleUpdateVisualization}
          />
        </div>
      )}
      
      {solution && (
        <>
          <div className="animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Monte Carlo</h2>
            <MonteCarloForm 
              onSimulate={handleMonteCarloSimulation}
              isSimulating={isSimulating}
            />
            {isSimulating && (
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${simulationProgress * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Progress: {Math.round(simulationProgress * 100)}%
                </p>
              </div>
            )}
          </div>
          
          <div className="animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Export</h2>
            <ExportOptions 
              solution={solution}
              monteCarloResult={monteCarloResult}
              chartRef={chartRef}
            />
          </div>
        </>
      )}
    </>
  );

  const mainContent = (
    <>
      {solution && sdeInfo && (
        <>
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Visualization</h2>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
              <h3 className="font-medium text-lg mb-2 dark:text-white">{sdeInfo.name}</h3>
              <SafeEquationDisplay equation={sdeInfo.latex} />
            </div>
            <div ref={chartRef}>
              <Suspense fallback={<ChartSkeleton />}>
                <InteractiveChart 
                  solution={solution}
                  monteCarloResult={monteCarloResult}
                  showPaths={20}
                />
              </Suspense>
            </div>
          </div>
          
          {monteCarloResult && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Statistics</h2>
              <Suspense fallback={<StatisticsSkeleton />}>
                <StatisticsDisplay result={monteCarloResult} />
              </Suspense>
            </div>
          )}
          
          {currentParams && currentSdeType && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Sensitivity Analysis</h2>
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <SensitivityAnalysis 
                  sdeType={currentSdeType}
                  baseParams={currentParams}
                />
              </Suspense>
            </div>
          )}
        </>
      )}
      
      {!solution && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No simulation yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure parameters and click "Generate Solution" to start
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors">
        <DarkModeToggle />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 animate-fade-in">
            Stochastic Differential Equation Solver
          </h1>
          
          <MobileLayout
            sidebar={sidebarContent}
            main={mainContent}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
}