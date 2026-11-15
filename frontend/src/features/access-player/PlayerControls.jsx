import { useState } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import './PlayerControls.css'

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleFullscreen,
  hasSignLanguage,
  hasAudioDescription,
  onToggleSignLanguage,
  onToggleAudioDescription,
  isSignLanguageActive,
  isAudioDescriptionActive,
}) {
  const { preferences, updatePreference } = useAccessibility()
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  const handleTimelineChange = (e) => {
    onSeek(Number(e.target.value))
  }

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

  return (
    <div className="player-controls-container" role="toolbar" aria-label="Media Player Controls">
      {/* Timeline Scrub Bar */}
      <div className="timeline-wrapper">
        <label htmlFor="player-timeline" className="sr-only">
          Video timeline progress. Current time {formatTime(currentTime)} of {formatTime(duration)}
        </label>
        <input
          id="player-timeline"
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleTimelineChange}
          className="timeline-slider"
          aria-valuemin="0"
          aria-valuemax={duration || 100}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>

      <div className="controls-row">
        {/* Left Side: Playback & Volume */}
        <div className="controls-group">
          <button
            type="button"
            className="control-btn play-btn"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause video (Space or K)' : 'Play video (Space or K)'}
            title={isPlaying ? 'Pause (Space or K)' : 'Play (Space or K)'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            aria-label="Rewind 10 seconds (J or Left Arrow)"
            title="Rewind 10 seconds (J)"
          >
            &minus;10s
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            aria-label="Forward 10 seconds (L or Right Arrow)"
            title="Forward 10 seconds (L)"
          >
            +10s
          </button>

          <div className="volume-group">
            <button
              type="button"
              className="control-btn mute-btn"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute sound (M)' : 'Mute sound (M)'}
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            </button>
            <label htmlFor="volume-slider" className="sr-only">
              Volume level {Math.round(volume * 100)} percent
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="volume-slider"
              aria-label="Volume level"
            />
          </div>

          <div className="time-display" aria-live="off">
            <span>{formatTime(currentTime)}</span>
            <span aria-hidden="true"> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Accessibility Toggles, Speed, Fullscreen */}
        <div className="controls-group">
          {/* Captions */}
          <button
            type="button"
            className={`control-btn badge-btn ${preferences.captionsEnabled ? 'active' : ''}`}
            onClick={() => updatePreference('captionsEnabled', !preferences.captionsEnabled)}
            aria-label={`Toggle closed captions. Currently ${preferences.captionsEnabled ? 'on' : 'off'}`}
            aria-pressed={preferences.captionsEnabled}
            title="Toggle Captions (C)"
          >
            CC
          </button>

          <select
            className="lang-select"
            value={preferences.language}
            onChange={(e) => updatePreference('language', e.target.value)}
            aria-label="Select caption and audio language"
          >
            <option value="en">EN</option>
            <option value="am">አማ / AM</option>
          </select>

          {/* EthSL Sign Language Window */}
          {hasSignLanguage && (
            <button
              type="button"
              className={`control-btn badge-btn ${isSignLanguageActive ? 'active' : ''}`}
              onClick={onToggleSignLanguage}
              aria-label={`Toggle Ethiopian Sign Language overlay. Currently ${isSignLanguageActive ? 'visible' : 'hidden'}`}
              aria-pressed={isSignLanguageActive}
              title="Toggle Ethiopian Sign Language (S)"
            >
              EthSL
            </button>
          )}

          {/* Audio Description */}
          {hasAudioDescription && (
            <button
              type="button"
              className={`control-btn badge-btn ${isAudioDescriptionActive ? 'active' : ''}`}
              onClick={onToggleAudioDescription}
              aria-label={`Toggle Audio Description narration. Currently ${isAudioDescriptionActive ? 'enabled' : 'disabled'}`}
              aria-pressed={isAudioDescriptionActive}
              title="Toggle Audio Description (D)"
            >
              AD
            </button>
          )}

          {/* Speed */}
          <div className="speed-dropdown-wrapper">
            <button
              type="button"
              className="control-btn speed-btn"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              aria-expanded={showSpeedMenu}
              aria-label={`Playback speed, currently ${playbackRate}x`}
              title="Playback speed"
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="speed-menu" role="menu" aria-label="Playback Speed Options">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    role="menuitemradio"
                    aria-checked={playbackRate === rate}
                    className={`speed-option ${playbackRate === rate ? 'selected' : ''}`}
                    onClick={() => {
                      onPlaybackRateChange(rate)
                      setShowSpeedMenu(false)
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            className="control-btn"
            onClick={onToggleFullscreen}
            aria-label="Toggle Fullscreen (F)"
            title="Fullscreen (F)"
          >
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  )
}
