'use client';

import { Component, ReactNode } from 'react';
import EquationDisplay from './EquationDisplay';

interface Props {
  equation: string;
  className?: string;
}

interface State {
  hasError: boolean;
}

class SafeEquationDisplay extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Equation display error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className={`text-center font-mono text-gray-600 dark:text-gray-400 ${this.props.className || ''}`}>
          {this.props.equation}
        </div>
      );
    }

    return <EquationDisplay equation={this.props.equation} className={this.props.className} />;
  }
}

export default SafeEquationDisplay;