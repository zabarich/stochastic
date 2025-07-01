'use client';

import { useEffect, useRef } from 'react';

interface EquationDisplayProps {
  equation: string;
  className?: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export default function EquationDisplay({ equation, className = '' }: EquationDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax script if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => {
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
          },
          startup: {
            ready: () => {
              window.MathJax.startup.defaultReady();
              renderEquation();
            }
          }
        };
      };
      document.head.appendChild(script);
    } else {
      renderEquation();
    }
  }, [equation]);

  const renderEquation = () => {
    if (containerRef.current && window.MathJax) {
      containerRef.current.innerHTML = `$$${equation}$$`;
      window.MathJax.typesetPromise([containerRef.current]).catch((e: any) => {
        console.error('MathJax rendering error:', e);
      });
    }
  };

  return (
    <div ref={containerRef} className={`text-center ${className}`}>
      {/* Fallback display */}
      <code className="font-mono text-gray-600">{equation}</code>
    </div>
  );
}