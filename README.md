# Stochastic Differential Equation Solver

A professional web application for solving and visualizing stochastic differential equations (SDEs) with Monte Carlo simulations.

## Features

### Core Functionality
- **Three SDE Models**:
  - Geometric Brownian Motion (dX = μX dt + σX dW)
  - Ornstein-Uhlenbeck Process (dX = θ(μ-X) dt + σ dW)
  - Arithmetic Brownian Motion (dX = μ dt + σ dW)
- **Euler-Maruyama numerical solver**
- **Real-time parameter adjustment**

### Monte Carlo Simulation
- Generate 10-10,000 solution paths
- Statistical analysis with mean, variance, and percentiles
- Confidence interval visualization
- Progress tracking for long simulations

### Interactive Visualization
- Chart.js-powered interactive charts
- Zoom and pan functionality
- Real-time parameter sliders
- Multiple path visualization with transparency

### Advanced Features
- **Parameter sensitivity analysis**
- **Export options**: CSV, JSON, PNG
- **9 preset templates** across Finance, Physics, Biology
- **LaTeX equation rendering**
- **Dark mode support**
- **Mobile-responsive design**

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Math**: Custom SDE solver implementation
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

This app is optimized for deployment on Vercel:

1. Push to GitHub
2. Import project on Vercel
3. Deploy with default settings

## Usage Guide

1. **Choose Parameters**: Use the form or select a preset template
2. **Generate Solution**: Click to solve the SDE
3. **Adjust in Real-Time**: Use sliders to modify parameters
4. **Run Monte Carlo**: Simulate multiple paths for statistical analysis
5. **Analyze Sensitivity**: See how parameters affect outcomes
6. **Export Results**: Download data or charts

## Mathematical Methods

- **Wiener Process**: Box-Muller transform for normal distribution
- **Euler-Maruyama**: First-order numerical scheme for SDEs
- **Statistics**: Online algorithms for mean, variance, percentiles
- **Sensitivity**: Parameter sweep with multiple simulations

## Performance

- Optimized for 1000+ simulation paths
- Lazy loading for heavy components
- Efficient batch processing
- Memory-conscious data structures

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License - feel free to use for educational or commercial purposes.

## Contributing

Contributions welcome! Please submit PRs for:
- New SDE models
- Performance improvements
- Additional export formats
- UI/UX enhancements