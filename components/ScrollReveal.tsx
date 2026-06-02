'use client'
import React from 'react'
import { useScrollReveal, revealStyles } from '@/hooks/useScrollReveal'

type Animation = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp'

interface Props {
  children: React.ReactNode
  animation?: Animation
  delay?: number
  threshold?: number
  style?: React.CSSProperties
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.12,
  style = {},
  className,
}: Props) {
  const { ref, visible } = useScrollReveal({ threshold, delay })
  const animStyle = revealStyles[animation](visible, 0)

  return (
    <div ref={ref} className={className} style={{ ...animStyle, ...style }}>
      {children}
    </div>
  )
}
