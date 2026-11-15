import { useMemo } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import './CaptionManager.css'

export default function CaptionManager({ currentTime, cues = [] }) {
  const { preferences } = useAccessibility()

  const activeCue = useMemo(() => {
    if (!preferences.captionsEnabled || !cues || cues.length === 0) return null
    return cues.find(
      (cue) => currentTime >= cue.start && currentTime <= cue.end
    )
  }, [currentTime, cues, preferences.captionsEnabled])

  if (!preferences.captionsEnabled || !activeCue) return null

  const text = preferences.language === 'am' ? activeCue.am : activeCue.en

  return (
    <div
      className={`caption-container caption-size-${preferences.captionSize} caption-color-${preferences.captionColor}`}
      style={{
        '--caption-opacity': preferences.captionOpacity / 100,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="caption-text">{text}</span>
    </div>
  )
}
