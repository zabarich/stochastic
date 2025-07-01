# Build a Stochastic Differential Equation Solver Web App

Create a sophisticated web application that solves and visualizes stochastic differential equations (SDEs). This should be a multi-phase project that demonstrates complex mathematical implementation with an intuitive interface.

## Project Overview
Build a Next.js web application deployed on Vercel that allows users to input SDE parameters, solve them numerically, and visualize the results with multiple solution paths.

## Phase 1: Core SDE Solver
- Create a Next.js project with TypeScript
- Implement Euler-Maruyama numerical method for SDE solving
- Support these classic SDEs:
  - Geometric Brownian Motion: `dX = μX dt + σX dW`
  - Ornstein-Uhlenbeck Process: `dX = θ(μ-X) dt + σ dW`
  - Arithmetic Brownian Motion: `dX = μ dt + σ dW`
- Create input form for parameters (μ, σ, θ, initial value, time horizon, time steps)
- Generate single solution path

## Phase 2: Monte Carlo Simulation
- Extend solver to generate multiple solution paths (100-1000 paths)
- Implement parallel computation for performance
- Add statistical analysis (mean, variance, percentiles)
- Create summary statistics display

## Phase 3: Interactive Visualization
- Use Chart.js or D3.js for dynamic plotting
- Plot multiple solution paths with transparency
- Add confidence intervals and mean path
- Interactive controls for zooming, parameter adjustment
- Real-time plot updates as parameters change

## Phase 4: Advanced Features
- Parameter sensitivity analysis
- Export functionality (CSV, PNG)
- Preset equation templates
- Mathematical equation display using LaTeX (MathJax)
- Performance optimization for large simulations

## Phase 5: Polish & Deploy
- Responsive design with Tailwind CSS
- Professional UI/UX with loading states
- Error handling and input validation
- Deploy to Vercel with proper configuration
- Add documentation and usage examples

## Technical Requirements
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript throughout
- **Styling**: Tailwind CSS
- **Math Library**: Consider using libraries like ml-matrix for linear algebra
- **Visualization**: Chart.js or D3.js
- **Deployment**: Vercel
- **Performance**: Optimize for handling 1000+ simulation paths

## Key Mathematical Concepts to Implement
- Wiener process (Brownian motion) generation
- Euler-Maruyama discretization scheme
- Monte Carlo path simulation
- Statistical moment calculations
- Numerical stability considerations

## Success Criteria
- Accurate numerical solutions matching theoretical expectations
- Smooth, interactive visualizations
- Professional, intuitive user interface
- Fast performance even with large simulations
- Mobile-responsive design
- Clear mathematical documentation

Start with Phase 1 and build incrementally. Each phase should be fully functional before moving to the next. Focus on clean, maintainable code that properly handles the mathematical complexity while remaining user-friendly.