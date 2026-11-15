import { useAccessibility } from '../../context/AccessibilityContext'
import './Header.css'

export default function Header({ backendHealth, onOpenSettings }) {
  const { preferences, updatePreference } = useAccessibility()

  return (
    <header role="banner" className="app-header">
      <div className="header-inner">
        <div className="brand-group">
          <span className="brand-logo" aria-hidden="true">
            AL
          </span>
          <div>
            <h1 className="brand-heading">
              ACCESSBRIDGE <span className="brand-subname">/ AccessLearn Ethiopia</span>
            </h1>
            <p className="brand-tagline">
              One lesson. Multiple ways to learn. No learner left behind.
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-toggle-group" role="group" aria-label="Interface Language">
            <button
              type="button"
              className={`lang-btn ${preferences.language === 'en' ? 'active' : ''}`}
              onClick={() => updatePreference('language', 'en')}
              aria-pressed={preferences.language === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${preferences.language === 'am' ? 'active' : ''}`}
              onClick={() => updatePreference('language', 'am')}
              aria-pressed={preferences.language === 'am'}
            >
              አማ
            </button>
          </div>

          {/* Accessibility Settings Quick Button */}
          <button
            type="button"
            className="settings-quick-btn"
            onClick={onOpenSettings}
            aria-label="Open accessibility options panel"
            title="Accessibility Settings"
          >
            ♿ የተደራሽነት ምርጫዎች
          </button>

          {/* Backend Status Pill */}
          <div
            className="system-pill"
            aria-label={`Backend service status: ${backendHealth.data?.healthy ? 'Connected' : 'Offline'}`}
          >
            <span
              className={`status-dot ${backendHealth.data?.healthy ? 'healthy' : 'pending'}`}
              aria-hidden="true"
            />
            <span>
              {backendHealth.loading
                ? 'Connecting...'
                : backendHealth.data?.healthy
                ? 'Backend Live'
                : 'Offline Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
