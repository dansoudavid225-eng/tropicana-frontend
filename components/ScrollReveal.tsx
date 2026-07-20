'use client'
import React from 'react'
import { useScrollReveal, revealStyles } from '@/hooks/useScrollReveal'

type Animation = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp'

interface Props {
  children: React.ReactNode
  animation?: Animation
  /** Alias de `animation`, conservé pour compatibilité avec les appels existants (`variant="fadeUp"`, etc.) */
  variant?: Animation
  delay?: number
  threshold?: number
  style?: React.CSSProperties
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export default function ScrollReveal({
  children,
  animation,
  variant,
  delay = 0,
  threshold = 0.12,
  style = {},
  className,
}: Props) {
  const resolvedAnimation: Animation = variant ?? animation ?? 'fadeUp'
  const { ref, visible } = useScrollReveal({ threshold, delay })
  const animStyle = revealStyles[resolvedAnimation](visible, 0)

  return (
    <div ref={ref} className={className} style={{ ...animStyle, ...style }}>
      {children}
    </div>
  )
}
