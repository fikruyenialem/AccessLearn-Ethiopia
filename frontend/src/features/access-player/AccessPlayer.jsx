import { useState, useRef, useEffect, useCallback } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import PlayerControls from './PlayerControls'
import CaptionManager from './CaptionManager'
import EthSLOverlay from './EthSLOverlay'
import InteractiveTranscript from './InteractiveTranscript'
import './AccessPlayer.css'

export default function AccessPlayer({
  videoSrc,
  signLanguageSrc,
  audioDescriptionSrc,
  transcriptCues = [],
  title = 'Accessible Learning Lecture',
  onProgressUpdate,
}) {
  const { preferences, updatePreference } = useAccessibility()

  const playerContainerRef = useRef(null)
  const videoRef = useRef(null)
  const adAudioRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [hasError, setHasError] = useState(false)

  // Sync Audio Description audio element with main video
  useEffect(() => {
    const ad = adAudioRef.current
    if (!ad) return

    if (preferences.audioDescriptionEnabled && isPlaying) {
      if (Math.abs(ad.currentTime - currentTime) > 0.3) {
        ad.currentTime = currentTime
      }
      ad.play().catch(() => {})
    } else {
      ad.pause()
    }
  }, [isPlaying, currentTime, preferences.audioDescriptionEnabled])

  // Periodic progress update callback
  useEffect(() => {
    if (duration > 0 && currentTime > 0 && onProgressUpdate) {
      const percentage = Math.min(100, (currentTime / duration) * 100)
      onProgressUpdate(percentage, currentTime)
    }
  }, [currentTime, duration, onProgressUpdate])

  // Play / Pause toggle
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  // Seek
  const handleSeek = useCallback((time) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  // Volume
  const handleVolumeChange = useCallback((newVolume) => {
    const video = videoRef.current
    if (!video) return
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, [])

  // Mute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  // Playback Rate
  const handlePlaybackRateChange = useCallback((rate) => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = rate
    setPlaybackRate(rate)
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = playerContainerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  // Keyboard navigation shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // Don't intercept if focused on inputs/selects
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlayPause()
          break
        case 'j':
        case 'arrowleft':
          e.preventDefault()
          handleSeek(Math.max(0, currentTime - 10))
          break
        case 'l':
        case 'arrowright':
          e.preventDefault()
          handleSeek(Math.min(duration, currentTime + 10))
          break
        case 'arrowup':
          e.preventDefault()
          handleVolumeChange(Math.min(1, volume + 0.1))
          break
        case 'arrowdown':
          e.preventDefault()
          handleVolumeChange(Math.max(0, volume - 0.1))
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'c':
          e.preventDefault()
          updatePreference('captionsEnabled', !preferences.captionsEnabled)
          break
        case 's':
          e.preventDefault()
          if (signLanguageSrc) {
            updatePreference('ethSLEnabled', !preferences.ethSLEnabled)
          }
          break
        case 'd':
          e.preventDefault()
          if (audioDescriptionSrc) {
            updatePreference('audioDescriptionEnabled', !preferences.audioDescriptionEnabled)
          }
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case '<':
        case ',':
          e.preventDefault()
          handlePlaybackRateChange(Math.max(0.5, playbackRate - 0.25))
          break
        case '>':
        case '.':
          e.preventDefault()
          handlePlaybackRateChange(Math.min(2.0, playbackRate + 0.25))
          break
        default:
          break
      }
    },
    [
      togglePlayPause,
      handleSeek,
      currentTime,
      duration,
      handleVolumeChange,
      volume,
      toggleMute,
      preferences.captionsEnabled,
      preferences.ethSLEnabled,
      preferences.audioDescriptionEnabled,
      updatePreference,
      signLanguageSrc,
      audioDescriptionSrc,
      toggleFullscreen,
      handlePlaybackRateChange,
      playbackRate,
    ]
  )

  return (
    <div
      ref={playerContainerRef}
      className="access-player-shell"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      role="region"
      aria-label={`AccessPlayer media player: ${title}`}
    >
      <div className="player-viewport">
        {/* Main Video Surface */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="main-video-surface"
          onClick={togglePlayPause}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration)
            setHasError(false)
          }}
          onError={() => setHasError(true)}
          playsInline
          aria-label={title}
        />

        {/* Optional Secondary Audio Description Track */}
        {audioDescriptionSrc && (
          <audio
            ref={adAudioRef}
            src={audioDescriptionSrc}
            preload="auto"
            aria-hidden="true"
          />
        )}

        {/* Media Loading Error Message */}
        {hasError && (
          <div className="player-error-overlay" role="alert">
            <p><strong>Media notice:</strong> The selected remote video stream could not be loaded. Transcripts and offline packages remain fully accessible below.</p>
          </div>
        )}

        {/* Multilingual Captions Overlay */}
        <CaptionManager currentTime={currentTime} cues={transcriptCues} />

        {/* Ethiopian Sign Language Movable Window */}
        {signLanguageSrc && preferences.ethSLEnabled && (
          <EthSLOverlay
            videoSrc={signLanguageSrc}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onClose={() => updatePreference('ethSLEnabled', false)}
          />
        )}

        {/* Accessible Control Bar */}
        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          onPlayPause={togglePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onPlaybackRateChange={handlePlaybackRateChange}
          onToggleFullscreen={toggleFullscreen}
          hasSignLanguage={Boolean(signLanguageSrc)}
          hasAudioDescription={Boolean(audioDescriptionSrc)}
          isSignLanguageActive={preferences.ethSLEnabled}
          isAudioDescriptionActive={preferences.audioDescriptionEnabled}
          onToggleSignLanguage={() => updatePreference('ethSLEnabled', !preferences.ethSLEnabled)}
          onToggleAudioDescription={() => updatePreference('audioDescriptionEnabled', !preferences.audioDescriptionEnabled)}
        />
      </div>

      {/* Keyboard Shortcuts Documentation Helper for Screen Readers & Learners */}
      <div className="keyboard-shortcuts-bar" aria-label="Keyboard Shortcuts">
        <span className="shortcut-label">Shortcuts:</span>
        <span className="shortcut-item"><kbd>Space</kbd> Play/Pause</span>
        <span className="shortcut-item"><kbd>J</kbd>/<kbd>L</kbd> ±10s Seek</span>
        <span className="shortcut-item"><kbd>C</kbd> Captions</span>
        <span className="shortcut-item"><kbd>S</kbd> Sign Language</span>
        <span className="shortcut-item"><kbd>D</kbd> Audio Description</span>
        <span className="shortcut-item"><kbd>M</kbd> Mute</span>
        <span className="shortcut-item"><kbd>F</kbd> Fullscreen</span>
      </div>

      {/* Interactive Transcript Panel */}
      <InteractiveTranscript
        currentTime={currentTime}
        cues={transcriptCues}
        onSeek={handleSeek}
      />
    </div>
  )
}
