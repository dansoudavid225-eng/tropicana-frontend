'use client'
import { createContext, useContext, ReactNode } from 'react'

type Theme = 'light'
type ThemeContextType = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
