import { useAccessibility } from '../../context/AccessibilityContext'
import './TabNav.css'

export default function TabNav({ activeTab, onSelectTab, offlineCount = 0 }) {
  const { t } = useAccessibility()

  const tabs = [
    { id: 'courses', label: t.nav.courses },
    { id: 'careers', label: t.nav.careers },
    {
      id: 'offline',
      label: t.nav.offline,
      count: offlineCount > 0 ? `(${offlineCount})` : null,
    },
    { id: 'verify', label: t.nav.verify },
    { id: 'accessibility', label: t.nav.accessibility },
  ]

  return (
    <nav className="tab-navigation" aria-label="Primary Platform Navigation">
      <div className="tab-nav-inner" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`section-${tab.id}`}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
            >
              <span className="tab-label-text">{tab.label}</span>
              {tab.count && <span className="tab-count-text">{tab.count}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
