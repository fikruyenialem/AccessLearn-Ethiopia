import './TabNav.css'

export default function TabNav({ activeTab, onSelectTab, offlineCount = 0 }) {
  const tabs = [
    { id: 'courses', label: 'የትምህርት ካታሎግ / Courses' },
    { id: 'careers', label: 'የሥራ ዕድሎች / Career Gateway' },
    {
      id: 'offline',
      label: 'ከመስመር ውጭ / Offline Library',
      count: offlineCount > 0 ? `(${offlineCount})` : null,
    },
    { id: 'verify', label: 'ማረጋገጫ / Certificates' },
    { id: 'accessibility', label: 'ተደራሽነት / Accessibility' },
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
