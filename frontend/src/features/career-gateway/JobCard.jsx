import { useState } from 'react'
import './JobCard.css'

export default function JobCard({ job }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    const text = job.audio_summary || `${job.title} at ${job.organization}. ${job.description}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
    setIsPlayingAudio(true)
  }

  return (
    <article className="job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card-header">
        <div>
          <span className="job-org">{job.organization}</span>
          <h3 id={`job-title-${job.id}`} className="job-title">
            {job.title}
          </h3>
        </div>
        <button
          type="button"
          className={`audio-summary-btn ${isPlayingAudio ? 'active' : ''}`}
          onClick={handlePlayAudio}
          aria-label={isPlayingAudio ? `Stop audio summary for ${job.title}` : `Listen to audio overview for ${job.title}`}
          title="Audio Summary"
        >
          {isPlayingAudio ? '⏹ Stop Summary' : '🔊 Listen to Summary'}
        </button>
      </div>

      <div className="job-meta-row">
        <span className="job-meta-pill">📍 {job.location}</span>
        <span className="job-meta-pill">💼 {job.employment_type}</span>
      </div>

      <p className="job-desc">{job.description}</p>

      {job.requirements && (
        <div className="job-section">
          <strong className="section-label">መመዘኛዎች / Requirements:</strong>
          <p className="section-text">{job.requirements}</p>
        </div>
      )}

      {job.accommodations && (
        <div className="job-section accommodations-box">
          <strong className="section-label">♿ Accommodations & Assistive Support:</strong>
          <p className="section-text">{job.accommodations}</p>
        </div>
      )}

      <div className="job-card-footer">
        <a
          href={job.application_url}
          target="_blank"
          rel="noreferrer"
          className="apply-link"
          aria-label={`Apply for ${job.title} at ${job.organization} (opens in new tab)`}
        >
          ማመልከቻ አስገባ / Apply for Position ↗
        </a>
      </div>
    </article>
  )
}
