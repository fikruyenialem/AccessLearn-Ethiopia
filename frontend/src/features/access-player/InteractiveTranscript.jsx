import { useState, useMemo, useEffect, useRef } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import './InteractiveTranscript.css'

function formatTimestamp(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function InteractiveTranscript({
  currentTime,
  cues = [],
  onSeek,
}) {
  const { preferences, t } = useAccessibility()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [fontSizeOffset, setFontSizeOffset] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)
  const activeLineRef = useRef(null)

  const lang = preferences.language === 'am' ? 'am' : 'en'

  // Filter cues based on search query
  const matchingIndices = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const matches = []
    cues.forEach((cue, index) => {
      const text = (lang === 'am' ? cue.am : cue.en).toLowerCase()
      if (text.includes(q)) {
        matches.push(index)
      }
    })
    return matches
  }, [cues, searchQuery, lang])

  // Identify active cue index based on playback time
  const activeIndex = useMemo(() => {
    return cues.findIndex(
      (cue) => currentTime >= cue.start && currentTime <= cue.end
    )
  }, [currentTime, cues])

  // Auto-scroll active transcript line into view smoothly
  useEffect(() => {
    if (activeLineRef.current && !searchQuery) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeIndex, searchQuery])

  const handleNextMatch = () => {
    if (matchingIndices.length === 0) return
    const next = (currentMatchIndex + 1) % matchingIndices.length
    setCurrentMatchIndex(next)
    const targetCue = cues[matchingIndices[next]]
    if (targetCue) onSeek(targetCue.start)
  }

  const handlePrevMatch = () => {
    if (matchingIndices.length === 0) return
    const prev = (currentMatchIndex - 1 + matchingIndices.length) % matchingIndices.length
    setCurrentMatchIndex(prev)
    const targetCue = cues[matchingIndices[prev]]
    if (targetCue) onSeek(targetCue.start)
  }

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const fullText = cues.map((c) => (lang === 'am' ? c.am : c.en)).join(' ')
    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.lang = lang === 'am' ? 'am-ET' : 'en-US'
    utterance.rate = 0.95

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handleCopy = () => {
    const fullText = cues
      .map((c) => `[${formatTimestamp(c.start)}] ${lang === 'am' ? c.am : c.en}`)
      .join('\n')
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadTranscript = (format) => {
    let content = ''
    let mimeType = 'text/plain'
    let ext = 'txt'

    if (format === 'vtt') {
      ext = 'vtt'
      content = 'WEBVTT - AccessLearn Ethiopia Transcript\n\n'
      cues.forEach((c) => {
        content += `00:${formatTimestamp(c.start)}.000 --> 00:${formatTimestamp(c.end)}.000\n${lang === 'am' ? c.am : c.en}\n\n`
      })
    } else if (format === 'srt') {
      ext = 'srt'
      cues.forEach((c, idx) => {
        content += `${idx + 1}\n00:${formatTimestamp(c.start)},000 --> 00:${formatTimestamp(c.end)},000\n${lang === 'am' ? c.am : c.en}\n\n`
      })
    } else {
      content = cues
        .map((c) => `[${formatTimestamp(c.start)}] ${lang === 'am' ? c.am : c.en}`)
        .join('\n\n')
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accesslearn_transcript_${lang}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="transcript-panel" aria-labelledby="transcript-heading">
      <div className="transcript-header">
        <div className="transcript-title-group">
          <h3 id="transcript-heading" className="transcript-title">
            {t.transcript.title}
          </h3>
          <span className="transcript-badge">{t.transcript.synchronizedBadge}</span>
        </div>

        <div className="transcript-actions">
          {/* Read Aloud Button */}
          <button
            type="button"
            className={`action-btn ${isSpeaking ? 'active' : ''}`}
            onClick={handleReadAloud}
            aria-label={isSpeaking ? t.transcript.stopSpeech : t.transcript.readAloud}
            title={t.transcript.readAloud}
          >
            {isSpeaking ? t.transcript.stopSpeech : t.transcript.readAloud}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            className="action-btn"
            onClick={handleCopy}
            aria-label="Copy entire transcript with timestamps"
          >
            {copied ? t.transcript.copied : t.transcript.copy}
          </button>

          {/* Download Dropdown */}
          <select
            className="download-select"
            onChange={(e) => {
              if (e.target.value) {
                downloadTranscript(e.target.value)
                e.target.value = ''
              }
            }}
            aria-label="Download transcript in TXT, VTT, or SRT format"
          >
            <option value="">{t.transcript.export}</option>
            <option value="txt">{t.transcript.downloadTxt}</option>
            <option value="vtt">{t.transcript.downloadVtt}</option>
            <option value="srt">{t.transcript.downloadSrt}</option>
          </select>

          {/* Font Size Adjusters */}
          <div className="font-adjust-group" role="group" aria-label="Adjust transcript font size">
            <button
              type="button"
              className="font-btn"
              onClick={() => setFontSizeOffset(Math.max(-2, fontSizeOffset - 2))}
              aria-label="Decrease transcript text size"
            >
              A-
            </button>
            <button
              type="button"
              className="font-btn"
              onClick={() => setFontSizeOffset(Math.min(6, fontSizeOffset + 2))}
              aria-label="Increase transcript text size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Transcript Search Toolbar */}
      <div className="transcript-search-bar" role="search">
        <label htmlFor="transcript-search" className="sr-only">
          Search transcript text
        </label>
        <input
          id="transcript-search"
          type="search"
          placeholder={t.transcript.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentMatchIndex(0)
          }}
          className="search-input"
        />
        {searchQuery.trim() && (
          <div className="search-nav">
            <span className="search-match-count" aria-live="polite">
              {matchingIndices.length > 0
                ? `${currentMatchIndex + 1} ${t.transcript.of} ${matchingIndices.length}`
                : t.transcript.noMatches}
            </span>
            <button
              type="button"
              className="nav-btn"
              onClick={handlePrevMatch}
              disabled={matchingIndices.length === 0}
              aria-label="Previous match"
            >
              ▲
            </button>
            <button
              type="button"
              className="nav-btn"
              onClick={handleNextMatch}
              disabled={matchingIndices.length === 0}
              aria-label="Next match"
            >
              ▼
            </button>
          </div>
        )}
      </div>

      {/* Synchronized Transcript Lines */}
      <div
        className="transcript-content"
        tabIndex="0"
        role="region"
        aria-label="Synchronized speech lines. Click any timestamp or sentence to jump to that moment in the video."
        style={{ fontSize: `calc(15px + ${fontSizeOffset}px)` }}
      >
        {cues.map((cue, idx) => {
          const isActive = idx === activeIndex
          const isMatching = matchingIndices.includes(idx)
          const text = lang === 'am' ? cue.am : cue.en

          return (
            <div
              key={cue.id || idx}
              ref={isActive ? activeLineRef : null}
              className={`transcript-line ${isActive ? 'active' : ''} ${isMatching ? 'match' : ''}`}
              onClick={() => onSeek(cue.start)}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSeek(cue.start)
                }
              }}
              aria-current={isActive ? 'time' : undefined}
              aria-label={`${formatTimestamp(cue.start)}: ${text}. Click to jump to this timestamp.`}
            >
              <div className="line-meta">
                <span className="timestamp-badge">{formatTimestamp(cue.start)}</span>
                {isActive && <span className="active-pill" aria-hidden="true">{t.transcript.activeLabel}</span>}
              </div>
              <p className="line-text">{text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
