'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
export type Colorway = 'obsidian' | 'carbon' | 'yeezy'
export type ColorPalette = Colorway

export interface ColorwayOption {
  id: Colorway
  name: string
  subtitle: string
  bgHex: string
  accentHex: string
}

export const COLORWAYS: ColorwayOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Pure',
    subtitle: 'True #000000 & stark white contrast',
    bgHex: '#000000',
    accentHex: '#FFFFFF',
  },
  {
    id: 'carbon',
    name: 'Stealth Carbon',
    subtitle: 'Matte carbon weave (#0C0C0C) & bone-white',
    bgHex: '#0C0C0C',
    accentHex: '#E6E6E6',
  },
  {
    id: 'yeezy',
    name: 'Yeezy Graphite',
    subtitle: 'Warm stone graphite (#141312) & earth tokens',
    bgHex: '#141312',
    accentHex: '#D8D0C5',
  },
]

interface ThemeContextType {
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
  colorway: Colorway
  setColorway: (colorway: Colorway) => void
  palette: Colorway
  setPalette: (colorway: Colorway) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [colorway, setColorwayState] = useState<Colorway>('obsidian')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTimeout(() => setTheme(savedTheme), 0)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      document.documentElement.classList.add('dark')
    }

    const savedColorway = localStorage.getItem('colorway') as Colorway | null
    if (savedColorway && COLORWAYS.some((c) => c.id === savedColorway)) {
      setTimeout(() => setColorwayState(savedColorway), 0)
      document.documentElement.setAttribute('data-colorway', savedColorway)
    } else {
      document.documentElement.setAttribute('data-colorway', 'obsidian')
    }
  }, [])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleSetColorway = (newColorway: Colorway) => {
    setColorwayState(newColorway)
    localStorage.setItem('colorway', newColorway)
    document.documentElement.setAttribute('data-colorway', newColorway)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        colorway,
        setColorway: handleSetColorway,
        palette: colorway,
        setPalette: handleSetColorway,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a Providers')
  }
  return context
}
