import { useAccessibility } from '../../context/AccessibilityContext'
import './Header.css'

export default function Header({ backendHealth, onOpenSettings }) {
  const { preferences, updatePreference } = useAccessibility()

  return (
    <header role="banner" className="app-header">
      <div className="header-inner">
        <div className="brand-group">
          <div className="brand-text">
            <span className="brand-badge-label">Ethiopian Digital Learning Media</span>
            <h1 className="brand-heading">
              <span className="brand-primary">ACCESSBRIDGE</span>
              <span className="brand-separator"> / </span>
              <span className="brand-secondary">AccessLearn Ethiopia</span>
            </h1>
            <p className="brand-tagline">
              One lesson. Multiple ways to learn. No learner left behind.
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Subtle Language Toggle */}
          <div className="lang-toggle-group" role="group" aria-label="Interface Language Selection">
            <button
              type="button"
              className={`lang-btn ${preferences.language === 'en' ? 'active' : ''}`}
              onClick={() => updatePreference('language', 'en')}
              aria-pressed={preferences.language === 'en'}
            >
              English
            </button>
            <span className="lang-divider" aria-hidden="true">|</span>
            <button
              type="button"
              className={`lang-btn ${preferences.language === 'am' ? 'active' : ''}`}
              onClick={() => updatePreference('language', 'am')}
              aria-pressed={preferences.language === 'am'}
            >
              አማርኛ
            </button>
          </div>

          {/* Quiet Accessibility Options Button */}
          <button
            type="button"
            className="settings-action-btn"
            onClick={onOpenSettings}
            aria-label="Open accessibility preferences dialog"
          >
            Accessibility / ተደራሽነት
          </button>

          {/* Understated Backend Health Status */}
          <div
            className="system-indicator"
            aria-label={`Backend service status: ${backendHealth.data?.healthy ? 'Connected' : 'Offline'}`}
          >
            <span
              className={`status-marker ${backendHealth.data?.healthy ? 'online' : 'offline'}`}
              aria-hidden="true"
            />
            <span className="status-label">
              {backendHealth.loading
                ? 'Connecting'
                : backendHealth.data?.healthy
                ? 'Backend Active'
                : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
