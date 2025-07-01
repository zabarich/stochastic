import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stochastic Equation Solver | SDE Monte Carlo Simulator',
  description: 'Solve and visualize stochastic differential equations with Monte Carlo simulations. Features Geometric Brownian Motion, Ornstein-Uhlenbeck Process, parameter sensitivity analysis, and interactive charts.',
  keywords: 'stochastic differential equations, SDE solver, Monte Carlo simulation, Brownian motion, Ornstein-Uhlenbeck, financial modeling',
  authors: [{ name: 'SDE Solver Team' }],
  openGraph: {
    title: 'Stochastic Equation Solver',
    description: 'Professional SDE solver with Monte Carlo simulations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stochastic Equation Solver',
    description: 'Solve and visualize SDEs with Monte Carlo simulations',
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}