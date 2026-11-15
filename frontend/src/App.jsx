import { useState, useEffect } from 'react'
import { useAccessibility, AccessibilityProvider } from './context/AccessibilityContext'
import SkipLink from './components/common/SkipLink'
import Header from './components/common/Header'
import TabNav from './components/common/TabNav'
import Footer from './components/common/Footer'
import CourseCatalogue from './features/courses/CourseCatalogue'
import LessonView from './features/courses/LessonView'
import CareerGateway from './features/career-gateway/CareerGateway'
import OfflineLibrary from './features/offline-learning/OfflineLibrary'
import CertificateVerification from './features/certificates/CertificateVerification'
import AccessibilityPanel from './components/accessibility/AccessibilityPanel'
import { fetchHealth, fetchCourses, fetchCourseDetail } from './services/api'
import { getOfflineLessons } from './features/offline-learning/offlineStorage'
import './styles/accessibility.css'
import './App.css'

function AppContent() {
  const { t } = useAccessibility()
  const [activeTab, setActiveTab] = useState('courses')
  const [backendHealth, setBackendHealth] = useState({ loading: true, data: null, error: null })
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [offlineLessonsCount, setOfflineLessonsCount] = useState(0)

  // Register service worker for offline shell support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  // Check health and load initial courses
  useEffect(() => {
    fetchHealth()
      .then((data) => setBackendHealth({ loading: false, data, error: null }))
      .catch((err) => setBackendHealth({ loading: false, data: null, error: err.message }))

    fetchCourses()
      .then((data) => setCourses(data))
      .catch(() => {})

    getOfflineLessons()
      .then((list) => setOfflineLessonsCount(list.length))
      .catch(() => {})
  }, [])

  const handleSelectCourse = async (courseId) => {
    try {
      const detailed = await fetchCourseDetail(courseId)
      setSelectedCourse(detailed)
      if (detailed.lessons && detailed.lessons.length > 0) {
        setActiveLessonId(detailed.lessons[0].id)
      }
    } catch (err) {
      console.error('Could not load course details', err)
    }
  }

  const handleOpenOfflineLesson = (rawPack) => {
    // Construct mock course and open in LessonView directly from offline data
    const mockCourse = {
      id: rawPack.courseId || rawPack.course_id || 'offline-course',
      title: rawPack.course_title || 'Offline Saved Lesson',
      lessons: [
        {
          id: rawPack.lessonId || rawPack.lesson_id,
          title: rawPack.title,
          description: rawPack.description || '',
          content_html: rawPack.contentHtml || rawPack.content_html || '',
          sequence_number: rawPack.sequence_number || 1,
          estimated_duration: rawPack.estimated_duration_minutes || 10,
          media_assets: rawPack.media_assets || [],
        },
      ],
    }
    setSelectedCourse(mockCourse)
    setActiveLessonId(rawPack.lessonId || rawPack.lesson_id)
    setActiveTab('courses')
  }

  return (
    <div className="app-container">
      <SkipLink targetId="main-content" label={t.common.skipToMain} />

      <Header
        backendHealth={backendHealth}
        onOpenSettings={() => setActiveTab('accessibility')}
      />

      <TabNav
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId)
          if (tabId !== 'courses') {
            // Keep state intact
          }
        }}
        offlineCount={offlineLessonsCount}
      />

      <main id="main-content" role="main" tabIndex="-1" className="app-main">
        {activeTab === 'courses' && (
          <div id="section-courses" role="region" aria-labelledby="tab-courses">
            {selectedCourse ? (
              <LessonView
                course={selectedCourse}
                activeLessonId={activeLessonId}
                onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
                onBackToCatalogue={() => setSelectedCourse(null)}
              />
            ) : (
              <CourseCatalogue
                courses={courses}
                onSelectCourse={handleSelectCourse}
              />
            )}
          </div>
        )}

        {activeTab === 'careers' && (
          <div id="section-careers" role="region" aria-labelledby="tab-careers">
            <CareerGateway />
          </div>
        )}

        {activeTab === 'offline' && (
          <div id="section-offline" role="region" aria-labelledby="tab-offline">
            <OfflineLibrary onOpenLesson={handleOpenOfflineLesson} />
          </div>
        )}

        {activeTab === 'verify' && (
          <div id="section-verify" role="region" aria-labelledby="tab-verify">
            <CertificateVerification />
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div id="section-accessibility" role="region" aria-labelledby="tab-accessibility">
            <AccessibilityPanel />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  )
}
