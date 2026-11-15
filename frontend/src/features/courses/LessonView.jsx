import { useState, useEffect } from 'react'
import AccessPlayer from '../access-player/AccessPlayer'
import { saveOfflineLesson } from '../offline-learning/offlineStorage'
import { saveLessonProgress } from '../../services/api'
import './LessonView.css'

export default function LessonView({
  course,
  activeLessonId,
  onSelectLesson,
  onBackToCatalogue,
}) {
  const [activeTab, setActiveTab] = useState('player') // 'player' | 'document'
  const [downloadStatus, setDownloadStatus] = useState(null)
  const [progressState, setProgressState] = useState({ percentage: 0, status: 'in_progress' })
  const [transcriptCues, setTranscriptCues] = useState([])

  const currentLesson =
    course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0]

  useEffect(() => {
    fetch('/transcripts/lesson1.json')
      .then((res) => res.json())
      .then((data) => setTranscriptCues(data))
      .catch(() => {})
  }, [currentLesson])

  const videoAsset = currentLesson.media_assets?.find((m) => m.media_type === 'video')
  const signLanguageAsset = currentLesson.media_assets?.find(
    (m) => m.media_type === 'sign_language'
  )
  const audioDescAsset = currentLesson.media_assets?.find(
    (m) => m.media_type === 'audio_description'
  )

  const handleProgress = (percentage, seconds) => {
    setProgressState({
      percentage: Math.round(percentage),
      status: percentage >= 90 ? 'completed' : 'in_progress',
    })
    saveLessonProgress(currentLesson.id, {
      completion_percentage: percentage.toFixed(2),
      last_position: seconds.toFixed(2),
    }).catch(() => {})
  }

  const handleDownloadOffline = async (packageType) => {
    setDownloadStatus('Downloading...')
    try {
      await saveOfflineLesson(
        {
          ...currentLesson,
          course_title: course.title,
        },
        packageType
      )
      setDownloadStatus('Saved to Offline Library')
      setTimeout(() => setDownloadStatus(null), 3500)
    } catch (err) {
      setDownloadStatus(`Error: ${err.message}`)
      setTimeout(() => setDownloadStatus(null), 4000)
    }
  }

  return (
    <div className="lesson-view-container">
      {/* Top Breadcrumb & Clean Progress Indicator */}
      <div className="lesson-top-bar">
        <button
          type="button"
          className="back-link-btn"
          onClick={onBackToCatalogue}
          aria-label="Return to course catalogue"
        >
          &larr; Back to Curriculum
        </button>

        <div className="progress-indicator" aria-label={`Lesson progress: ${progressState.percentage}%`}>
          <span className="progress-text">Lesson Progress: {progressState.percentage}%</span>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressState.percentage}%` }} />
          </div>
        </div>
      </div>

      <header className="lesson-header">
        <span className="lesson-step">Unit {currentLesson.sequence_number}</span>
        <h2 className="lesson-title">{currentLesson.title}</h2>
        <p className="lesson-intro">{currentLesson.description}</p>
      </header>

      {/* Clean Mode Switcher */}
      <div className="lesson-mode-bar">
        <div className="mode-tabs" role="tablist" aria-label="Content Format Selection">
          <button
            type="button"
            role="tab"
            id="tab-player"
            aria-selected={activeTab === 'player'}
            aria-controls="panel-player"
            className={`mode-tab-btn ${activeTab === 'player' ? 'active' : ''}`}
            onClick={() => setActiveTab('player')}
          >
            Media Player &amp; Sign Language
          </button>

          <button
            type="button"
            role="tab"
            id="tab-document"
            aria-selected={activeTab === 'document'}
            aria-controls="panel-document"
            className={`mode-tab-btn ${activeTab === 'document' ? 'active' : ''}`}
            onClick={() => setActiveTab('document')}
          >
            Accessible Reading Document
          </button>
        </div>

        <div className="offline-utility">
          <button
            type="button"
            className="offline-pack-btn"
            onClick={() => handleDownloadOffline('full')}
            aria-label="Download 3G offline lesson package containing text, captions, and audio"
          >
            Save 3G Offline Pack
          </button>
          {downloadStatus && (
            <span className="download-feedback" aria-live="polite">
              {downloadStatus}
            </span>
          )}
        </div>
      </div>

      {/* Viewport Area */}
      <div className="lesson-viewport">
        {activeTab === 'player' ? (
          <div id="panel-player" role="tabpanel" aria-labelledby="tab-player">
            <AccessPlayer
              videoSrc={videoAsset?.storage_reference || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              signLanguageSrc={signLanguageAsset?.storage_reference}
              audioDescriptionSrc={audioDescAsset?.storage_reference}
              transcriptCues={transcriptCues}
              title={currentLesson.title}
              onProgressUpdate={handleProgress}
            />
          </div>
        ) : (
          <div
            id="panel-document"
            role="tabpanel"
            aria-labelledby="tab-document"
            className="reading-document-view"
          >
            <div className="document-masthead">
              <span className="document-badge">Tagged Accessible HTML Document</span>
              <span className="document-meta">Optimized for Screen Readers &bull; Zoom 200% Certified</span>
            </div>
            <div
              className="document-body"
              dangerouslySetInnerHTML={{ __html: currentLesson.content_html }}
            />
          </div>
        )}
      </div>

      {/* Multi-lesson Switcher */}
      {course.lessons.length > 1 && (
        <nav className="course-sequence-nav" aria-label="Curriculum Unit Sequence">
          <h3 className="sequence-heading">Course Units</h3>
          <div className="sequence-list">
            {course.lessons.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`sequence-item-btn ${l.id === currentLesson.id ? 'active' : ''}`}
                onClick={() => onSelectLesson(l.id)}
                aria-current={l.id === currentLesson.id ? 'true' : 'false'}
              >
                <span className="seq-num">{l.sequence_number}</span>
                <span className="seq-title">{l.title}</span>
                <span className="seq-duration">{l.estimated_duration} min</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
