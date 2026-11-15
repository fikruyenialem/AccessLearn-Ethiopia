import { useState, useEffect } from 'react'
import SkipLink from './components/common/SkipLink'
import './styles/accessibility.css'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    // Check backend health status at the explicit native endpoint
    fetch('http://127.0.0.1:8000/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }))
  }, [])

  return (
    <div className="app-container">
      <SkipLink targetId="main-content" />

      <header role="banner" className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-badge" aria-hidden="true">AL</span>
            <div>
              <h1 className="brand-title">AccessLearn Ethiopia</h1>
              <p className="brand-subtitle">Inclusive Digital Learning Platform</p>
            </div>
          </div>
          <div className="system-pill" aria-label="Backend connection status">
            <span
              className={`status-dot ${healthStatus.data?.healthy ? 'healthy' : 'pending'}`}
              aria-hidden="true"
            ></span>
            <span>
              {healthStatus.loading
                ? 'Checking backend...'
                : healthStatus.data?.healthy
                ? 'Backend Connected'
                : 'Backend Offline'}
            </span>
          </div>
        </div>
      </header>

      <main id="main-content" role="main" tabIndex="-1" className="app-main">
        <section className="hero-section" aria-labelledby="hero-title">
          <span className="track-badge">Digital Bridge Accessibility Hackathon 2026 — Track 2</span>
          <h2 id="hero-title" className="hero-title">
            Accessible Learning Media for Every Learner
          </h2>
          <p className="hero-description">
            AccessLearn Ethiopia is being designed to provide inclusive online learning experiences
            for Deaf and hard-of-hearing learners, blind and low-vision learners, and learners using
            low-bandwidth (2G/3G) connections.
          </p>
        </section>

        <section className="features-grid" aria-label="Planned Platform Capabilities">
          <div className="feature-card">
            <h3 className="feature-title">AccessPlayer Media Engine</h3>
            <p className="feature-desc">
              A planned embeddable video player designed for keyboard navigation, screen-reader
              compatibility, and custom accessible playback controls.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Multi-Language Captions</h3>
            <p className="feature-desc">
              Planned closed caption support for English and Amharic (Ethiopic script), with
              customizable font size, text colors, and background contrast.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Sign Language Overlay</h3>
            <p className="feature-desc">
              A planned movable and resizable video window intended to display synchronized sign
              language demonstration video alongside lecture content.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Synchronized Transcripts</h3>
            <p className="feature-desc">
              A planned interactive transcript panel designed to highlight active speech cues as
              media plays, with support for seeking and text download.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">3G Offline Learning Packs</h3>
            <p className="feature-desc">
              Planned downloadable ZIP packages tailored for low-bandwidth connections, bundling
              lightweight HTML lessons, audio summaries, and text transcripts.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Career Gateway & Certificates</h3>
            <p className="feature-desc">
              Planned accessible job listings with accommodation tags, audio job overviews, and
              verifiable course completion certificates.
            </p>
          </div>
        </section>

        <section className="status-section" aria-labelledby="status-title">
          <h3 id="status-title" className="status-heading">Milestone 1 Baseline Status</h3>
          <div className="status-card">
            <p><strong>Platform:</strong> AccessLearn Ethiopia</p>
            <p><strong>Target Standard:</strong> WCAG 2.2 Level AA</p>
            <p>
              <strong>Backend Health Endpoint:</strong>{' '}
              {healthStatus.loading ? (
                'Connecting to http://127.0.0.1:8000/api/v1/health...'
              ) : healthStatus.data ? (
                <span className="text-success">
                  Connected ({healthStatus.data.app} v{healthStatus.data.version}, Database: {healthStatus.data.database})
                </span>
              ) : (
                <span className="text-muted">
                  Offline ({healthStatus.error || 'Server not reachable at http://127.0.0.1:8000'})
                </span>
              )}
            </p>
          </div>
        </section>
      </main>

      <footer role="contentinfo" className="app-footer">
        <p>AccessLearn Ethiopia &bull; Digital Bridge Accessibility Hackathon 2026 &bull; Lideta Tech Hub, Addis Ababa</p>
      </footer>
    </div>
  )
}

export default App
