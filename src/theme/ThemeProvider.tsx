import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

interface Theme {
  mode: 'light' | 'dark'
}

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeProvidersProps {
  children: ReactNode
}

const STORAGE_KEY = 'themeMode'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const ThemeProviders: React.FC<ThemeProvidersProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme['mode']
    return { mode: storedTheme || 'light' }
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newMode = prevTheme.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, newMode)
      return { mode: newMode }
    })
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme['mode']
    const defaultTheme = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    setTheme({ mode: storedTheme || defaultTheme })
  }, [])

  // Use effect to update the status bar color based on the theme
  useEffect(() => {
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    const currentColor = theme.mode === 'light' ? '#fcfcfc' : '#2f2f2f'

    if (themeColorMetaTag) {
      themeColorMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'theme-color')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }

    // For iOS Safari
    const statusBarMetaTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (statusBarMetaTag) {
      statusBarMetaTag.setAttribute('content', currentColor)
    } else {
      const newStatusBarMetaTag = document.createElement('meta')
      newStatusBarMetaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      newStatusBarMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newStatusBarMetaTag)
    }
  }, [theme.mode])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={{ mode: theme.mode }}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProviders, useTheme }
