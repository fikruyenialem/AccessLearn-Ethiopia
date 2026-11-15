import { useState, useEffect } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
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
  const { t } = useAccessibility()
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
    if (confirm(t.offline.confirmDelete)) {
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
            {t.offline.title}
          </h2>
          <p className="offline-subtitle">
            {t.offline.subtitle}
          </p>
        </div>

        <div className="storage-summary-card">
          <span className="storage-label">{t.offline.storageInUse}</span>
          <span className="storage-value">{formatBytes(totalStorage)}</span>
          <span className="storage-count">({offlineLessons.length} {t.offline.lessonsStored})</span>
        </div>
      </div>

      {loading ? (
        <p>{t.common.loading}</p>
      ) : offlineLessons.length === 0 ? (
        <div className="offline-empty-state">
          <h3>{t.offline.emptyTitle}</h3>
          <p>{t.offline.emptyText}</p>
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
                <span className="offline-tag">{t.offline.tagReady}</span>
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
                  aria-label={`${t.offline.openBtn}: ${item.title}`}
                >
                  {t.offline.openBtn} &rarr;
                </button>
                <button
                  type="button"
                  className="delete-offline-btn"
                  onClick={(e) => handleDelete(item.lessonId, e)}
                  aria-label={`Delete ${item.title} from offline storage`}
                  title={t.offline.removeBtn}
                >
                  {t.offline.removeBtn}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
