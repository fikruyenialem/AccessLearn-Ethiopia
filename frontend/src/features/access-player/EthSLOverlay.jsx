import { useEffect, useRef } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import './EthSLOverlay.css'

export default function EthSLOverlay({
  videoSrc,
  isPlaying,
  currentTime,
  onClose,
}) {
  const { preferences, updatePreference, t } = useAccessibility()
  const ethVideoRef = useRef(null)

  // Keep EthSL video playback synchronized with main player
  useEffect(() => {
    const video = ethVideoRef.current
    if (!video) return

    if (Math.abs(video.currentTime - currentTime) > 0.3) {
      video.currentTime = currentTime
    }

    if (isPlaying && video.paused) {
      video.play().catch(() => {})
    } else if (!isPlaying && !video.paused) {
      video.pause()
    }
  }, [isPlaying, currentTime])

  const cyclePosition = () => {
    const positions = ['bottom-right', 'bottom-left', 'top-left', 'top-right']
    const currentIndex = positions.indexOf(preferences.ethSLPosition)
    const nextIndex = (currentIndex + 1) % positions.length
    updatePreference('ethSLPosition', positions[nextIndex])
  }

  const toggleSize = () => {
    updatePreference('ethSLSize', preferences.ethSLSize === 'normal' ? 'large' : 'normal')
  }

  return (
    <aside
      className={`ethsl-window pos-${preferences.ethSLPosition} size-${preferences.ethSLSize}`}
      aria-label={t.ethsl.ariaTitle}
      role="region"
    >
      <div className="ethsl-header">
        <span className="ethsl-badge">EthSL</span>
        <span className="ethsl-title">{t.ethsl.title}</span>
        <div className="ethsl-controls">
          <button
            type="button"
            className="ethsl-btn"
            onClick={cyclePosition}
            title={`Move position (Currently ${preferences.ethSLPosition})`}
            aria-label={`Reposition sign language window, currently at ${preferences.ethSLPosition}`}
          >
            {t.ethsl.posBtn}
          </button>
          <button
            type="button"
            className="ethsl-btn"
            onClick={toggleSize}
            title={`Toggle size (Currently ${preferences.ethSLSize})`}
            aria-label={`Toggle size between normal and large, currently ${preferences.ethSLSize}`}
          >
            {t.ethsl.sizeBtn}
          </button>
          <button
            type="button"
            className="ethsl-btn ethsl-btn-close"
            onClick={onClose}
            title={t.ethsl.closeBtn}
            aria-label={t.ethsl.closeBtn}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="ethsl-video-wrap">
        <video
          ref={ethVideoRef}
          src={videoSrc}
          muted
          playsInline
          aria-label="Ethiopian Sign Language interpretation stream"
        />
      </div>
    </aside>
  )
}
