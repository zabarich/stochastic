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
      try {
        containerRef.current.innerHTML = `$$${equation}$$`;
        // Check if typesetPromise exists
        if (window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([containerRef.current]).catch((e: any) => {
            console.error('MathJax rendering error:', e);
          });
        } else if (window.MathJax.typeset) {
          // Fallback for older MathJax versions
          window.MathJax.typeset([containerRef.current]);
        } else if (window.MathJax.Hub && window.MathJax.Hub.Queue) {
          // MathJax v2 fallback
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, containerRef.current]);
        }
      } catch (error) {
        console.error('Error rendering equation:', error);
      }
    }
  };

  return (
    <div ref={containerRef} className={`text-center ${className}`}>
      {/* Fallback display */}
      <code className="font-mono text-gray-600">{equation}</code>
    </div>
  );
}