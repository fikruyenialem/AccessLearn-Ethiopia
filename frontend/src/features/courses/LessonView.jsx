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

  // Load sample bilingual transcript cues
  useEffect(() => {
    fetch('/transcripts/lesson1.json')
      .then((res) => res.json())
      .then((data) => setTranscriptCues(data))
      .catch(() => {})
  }, [currentLesson])

  // Extract media assets
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
    setDownloadStatus('Downloading pack...')
    try {
      await saveOfflineLesson(
        {
          ...currentLesson,
          course_title: course.title,
        },
        packageType
      )
      setDownloadStatus('✓ Downloaded for offline use!')
      setTimeout(() => setDownloadStatus(null), 3500)
    } catch (err) {
      setDownloadStatus(`Download failed: ${err.message}`)
      setTimeout(() => setDownloadStatus(null), 4000)
    }
  }

  return (
    <div className="lesson-view-container">
      {/* Top Breadcrumb & Navigation */}
      <div className="lesson-top-nav">
        <button
          type="button"
          className="back-btn"
          onClick={onBackToCatalogue}
          aria-label="Back to course catalogue"
        >
          ← ተመለስ / All Courses
        </button>

        <div className="course-progress-badge" aria-label={`Lesson progress: ${progressState.percentage}%`}>
          <span>Progress: <strong>{progressState.percentage}%</strong></span>
          <div className="progress-bar-track" aria-hidden="true">
            <div className="progress-bar-fill" style={{ width: `${progressState.percentage}%` }} />
          </div>
        </div>
      </div>

      <header className="lesson-header">
        <span className="lesson-seq-badge">Lesson {currentLesson.sequence_number}</span>
        <h2 className="lesson-title">{currentLesson.title}</h2>
        <p className="lesson-desc">{currentLesson.description}</p>
      </header>

      {/* Mode Tabs: Multimedia Player vs Accessible HTML Document */}
      <div className="lesson-tabs" role="tablist" aria-label="Lesson Content Mode">
        <button
          type="button"
          role="tab"
          id="tab-player"
          aria-selected={activeTab === 'player'}
          aria-controls="panel-player"
          className={`lesson-tab-btn ${activeTab === 'player' ? 'active' : ''}`}
          onClick={() => setActiveTab('player')}
        >
          🎬 AccessPlayer (ቪዲዮ & ምልክት ቋንቋ)
        </button>

        <button
          type="button"
          role="tab"
          id="tab-document"
          aria-selected={activeTab === 'document'}
          aria-controls="panel-document"
          className={`lesson-tab-btn ${activeTab === 'document' ? 'active' : ''}`}
          onClick={() => setActiveTab('document')}
        >
          📄 ተደራሽ ጽሑፍ / Accessible HTML Document
        </button>

        <div className="offline-download-action">
          <button
            type="button"
            className="download-pack-btn"
            onClick={() => handleDownloadOffline('full')}
            aria-label="Download offline learning pack containing audio, transcript, and HTML"
          >
            ⬇ 3G Offline Pack
          </button>
          {downloadStatus && (
            <span className="download-status-msg" aria-live="polite">
              {downloadStatus}
            </span>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="lesson-body">
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
            className="accessible-document-panel"
          >
            <div className="doc-meta-bar">
              <span>Tagged Accessible HTML &bull; Screen-Reader Optimized &bull; Zoom 200% Safe</span>
            </div>
            <div
              className="doc-rendered-html"
              dangerouslySetInnerHTML={{ __html: currentLesson.content_html }}
            />
          </div>
        )}
      </div>

      {/* Lesson Switcher if multiple lessons exist in course */}
      {course.lessons.length > 1 && (
        <nav className="lesson-switcher-nav" aria-label="Course Lessons Navigation">
          <h3 className="switcher-heading">የትምህርት ክፍሎች / Course Lessons:</h3>
          <div className="switcher-list">
            {course.lessons.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`switcher-btn ${l.id === currentLesson.id ? 'active' : ''}`}
                onClick={() => onSelectLesson(l.id)}
                aria-current={l.id === currentLesson.id ? 'true' : 'false'}
              >
                {l.sequence_number}. {l.title} ({l.estimated_duration}m)
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
