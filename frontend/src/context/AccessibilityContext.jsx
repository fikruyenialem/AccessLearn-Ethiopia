/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { fetchPreferences, savePreferences } from '../services/api'

const AccessibilityContext = createContext(null)

const STORAGE_KEY = 'accesslearn_accessibility_prefs'

const DEFAULT_PREFERENCES = {
  theme: 'light',
  contrast: 'normal', // 'normal' | 'high' | 'monochrome'
  colorVision: 'none', // 'none' | 'protanopia_deuteranopia' | 'tritanopia'
  textScale: 1.0, // 1.0 | 1.15 | 1.30 | 1.50
  language: 'en', // 'en' | 'am'
  captionsEnabled: true,
  captionSize: 'medium', // 'small' | 'medium' | 'large' | 'xlarge'
  captionColor: 'white_on_black', // 'white_on_black' | 'yellow_on_black' | 'cyan_on_black' | 'black_on_white'
  captionOpacity: 75, // 50 | 75 | 100
  ethSLEnabled: false,
  ethSLPosition: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  ethSLSize: 'normal', // 'normal' | 'large'
  audioDescriptionEnabled: false,
  reducedMotion: false,
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES
    } catch {
      return DEFAULT_PREFERENCES
    }
  })

  // Apply visual settings to document root
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', preferences.theme)
    root.setAttribute('data-contrast', preferences.contrast)
    root.setAttribute('data-color-vision', preferences.colorVision)
    root.style.setProperty('--text-scale-factor', preferences.textScale.toString())
    root.setAttribute('lang', preferences.language)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (e) {
      console.warn('Could not save accessibility preferences to localStorage', e)
    }
  }, [preferences])

  // Try to load user preferences from backend on initial mount
  useEffect(() => {
    fetchPreferences()
      .then((data) => {
        if (data) {
          setPreferences((prev) => ({
            ...prev,
            language: data.preferred_language || prev.language,
            captionsEnabled: data.caption_enabled ?? prev.captionsEnabled,
            captionSize: data.caption_size || prev.captionSize,
            captionColor: data.caption_color || prev.captionColor,
            contrast: data.contrast_mode || prev.contrast,
            textScale: data.text_scale ? Number(data.text_scale) : prev.textScale,
          }))
        }
      })
      .catch(() => {
        // Fallback to local storage gracefully if offline
      })
  }, [])

  const updatePreference = (key, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value }
      // Sync to backend asynchronously
      savePreferences({
        preferred_language: updated.language,
        caption_enabled: updated.captionsEnabled,
        caption_size: updated.captionSize,
        caption_color: updated.captionColor,
        contrast_mode: updated.contrast,
        text_scale: updated.textScale,
      }).catch(() => {})
      return updated
    })
  }

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
