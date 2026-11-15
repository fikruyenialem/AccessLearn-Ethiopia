import { useState, useEffect } from 'react'
import { getOfflineLessons, deleteOfflineLesson } from './offlineStorage'
import './OfflineLibrary.css'

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function OfflineLibrary({ onOpenLesson }) {
  const [offlineLessons, setOfflineLessons] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLessons = () => {
    setLoading(true)
    getOfflineLessons()
      .then((lessons) => {
        setOfflineLessons(lessons)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    getOfflineLessons()
      .then((lessons) => {
        setOfflineLessons(lessons)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (lessonId, e) => {
    e.stopPropagation()
    if (confirm('Remove this downloaded lesson from your offline storage?')) {
      await deleteOfflineLesson(lessonId)
      loadLessons()
    }
  }

  const totalStorage = offlineLessons.reduce((sum, l) => sum + (l.fileSizeBytes || 0), 0)

  return (
    <section className="offline-library-section" aria-labelledby="offline-lib-title">
      <div className="offline-header">
        <div>
          <h2 id="offline-lib-title" className="offline-title">
            ከመስመር ውጭ ቤተ-መጽሐፍት / 3G Offline Library
          </h2>
          <p className="offline-subtitle">
            Downloaded lessons stored directly inside your browser storage (IndexedDB). Usable anywhere without active internet.
          </p>
        </div>

        <div className="storage-summary-card">
          <span className="storage-label">Local Storage In Use:</span>
          <span className="storage-value">{formatBytes(totalStorage)}</span>
          <span className="storage-count">({offlineLessons.length} lessons stored)</span>
        </div>
      </div>

      {loading ? (
        <p>Loading offline storage...</p>
      ) : offlineLessons.length === 0 ? (
        <div className="offline-empty-state">
          <div className="empty-icon">💾</div>
          <h3>ምንም የወረዱ ትምህርቶች የሉም / No Offline Lessons Yet</h3>
          <p>
            When viewing any course lesson, click <strong>"⬇ 3G Offline Pack"</strong> to save lessons,
            accessible HTML documents, and audio transcripts directly for offline study.
          </p>
        </div>
      ) : (
        <div className="offline-grid" role="list">
          {offlineLessons.map((item) => (
            <article
              key={item.lessonId}
              className="offline-card"
              role="listitem"
              aria-labelledby={`offline-title-${item.lessonId}`}
            >
              <div className="offline-card-top">
                <span className="offline-tag">Offline Ready</span>
                <span className="offline-size">{formatBytes(item.fileSizeBytes)}</span>
              </div>

              <h3 id={`offline-title-${item.lessonId}`} className="offline-card-title">
                {item.title}
              </h3>
              <p className="offline-course-name">{item.course_title || 'AccessLearn Core'}</p>

              <div className="offline-package-details">
                <span className="package-badge">HTML Document</span>
                <span className="package-badge">Bilingual Transcript</span>
                <span className="package-badge">Captions (EN/AM)</span>
              </div>

              <div className="offline-card-actions">
                <button
                  type="button"
                  className="open-offline-btn"
                  onClick={() => onOpenLesson(item.rawPack)}
                  aria-label={`Open downloaded lesson: ${item.title}`}
                >
                  ተማር / Open Lesson →
                </button>
                <button
                  type="button"
                  className="delete-offline-btn"
                  onClick={(e) => handleDelete(item.lessonId, e)}
                  aria-label={`Delete ${item.title} from offline storage`}
                  title="Remove from device storage"
                >
                  🗑
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
