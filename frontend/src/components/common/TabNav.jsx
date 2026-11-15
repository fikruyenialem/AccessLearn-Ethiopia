import './TabNav.css'

export default function TabNav({ activeTab, onSelectTab, offlineCount = 0 }) {
  const tabs = [
    { id: 'courses', label: 'ተማር / Learn & Player', icon: '📚' },
    { id: 'careers', label: 'የሥራ ዕድሎች / Career Gateway', icon: '💼' },
    { id: 'offline', label: 'ከመስመር ውጭ / Offline Library', icon: '💾', badge: offlineCount > 0 ? offlineCount : null },
    { id: 'verify', label: 'ማረጋገጫ / Certificates', icon: '🎓' },
    { id: 'accessibility', label: 'ተደራሽነት / Accessibility', icon: '♿' },
  ]

  return (
    <nav className="tab-navigation" aria-label="Main Platform Sections">
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
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.badge && <span className="tab-counter-badge">{tab.badge}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
