import { useAccessibility } from '../../context/AccessibilityContext'
import './AccessibilityPanel.css'

export default function AccessibilityPanel() {
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

  return (
    <section className="access-panel-section" aria-labelledby="settings-heading">
      <div className="panel-header">
        <div>
          <h2 id="settings-heading" className="panel-title">
            የተደራሽነት ምርጫዎች / Personalized Accessibility Settings
          </h2>
          <p className="panel-subtitle">
            Customize visual, auditory, cognitive, and motor preferences. Settings persist across sessions.
          </p>
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={resetPreferences}
          aria-label="Reset all accessibility preferences to defaults"
        >
          ወደ ነባሪ መልስ / Reset to Defaults
        </button>
      </div>

      <div className="settings-grid">
        {/* Section 1: Vision & Contrast */}
        <fieldset className="settings-group">
          <legend className="group-legend">የማየት ተደራሽነት / Vision & Contrast</legend>

          <div className="setting-item">
            <label htmlFor="pref-text-scale" className="setting-label">
              የፊደል መጠን / Text Scale ({Math.round(preferences.textScale * 100)}%):
            </label>
            <div className="scale-buttons-row">
              {[1.0, 1.15, 1.3, 1.5].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  className={`scale-btn ${preferences.textScale === scale ? 'active' : ''}`}
                  onClick={() => updatePreference('textScale', scale)}
                  aria-pressed={preferences.textScale === scale}
                >
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-contrast" className="setting-label">
              የቀለም ንፅፅር / Contrast Mode:
            </label>
            <select
              id="pref-contrast"
              value={preferences.contrast}
              onChange={(e) => updatePreference('contrast', e.target.value)}
              className="pref-select"
            >
              <option value="normal">መደበኛ / Default Contrast</option>
              <option value="high">ከፍተኛ ንፅፅር / High Contrast (WCAG AAA)</option>
              <option value="monochrome">ሞኖክሮም / Monochrome</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-theme" className="setting-label">
              ገጽታ / Display Theme:
            </label>
            <select
              id="pref-theme"
              value={preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value)}
              className="pref-select"
            >
              <option value="light">ደማቅ / Light Mode</option>
              <option value="dark">ጨለማ / Dark Mode</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-color-vision" className="setting-label">
              የቀለም እይታ እርዳታ / Color-Vision Accommodations:
            </label>
            <select
              id="pref-color-vision"
              value={preferences.colorVision}
              onChange={(e) => updatePreference('colorVision', e.target.value)}
              className="pref-select"
            >
              <option value="none">መደበኛ / Standard Color Palette</option>
              <option value="protanopia_deuteranopia">ቀይ-አረንጓዴ / Protanopia & Deuteranopia Palette</option>
              <option value="tritanopia">ሰማያዊ-ቢጫ / Tritanopia Palette</option>
            </select>
          </div>
        </fieldset>

        {/* Section 2: Captions & Hearing */}
        <fieldset className="settings-group">
          <legend className="group-legend">የመስማት ተደራሽነት / Captions & EthSL</legend>

          <div className="setting-item checkbox-item">
            <input
              id="pref-captions"
              type="checkbox"
              checked={preferences.captionsEnabled}
              onChange={(e) => updatePreference('captionsEnabled', e.target.checked)}
              className="pref-checkbox"
            />
            <label htmlFor="pref-captions" className="checkbox-label">
              የትርጉም ጽሑፍ ሁልጊዜ ይብራ / Enable Closed Captions by Default
            </label>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-caption-lang" className="setting-label">
              የትርጉም ቋንቋ / Preferred Caption Language:
            </label>
            <select
              id="pref-caption-lang"
              value={preferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className="pref-select"
            >
              <option value="en">English (EN)</option>
              <option value="am">አማርኛ / Amharic (AM)</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-caption-size" className="setting-label">
              የትርጉም ጽሑፍ መጠን / Caption Font Size:
            </label>
            <select
              id="pref-caption-size"
              value={preferences.captionSize}
              onChange={(e) => updatePreference('captionSize', e.target.value)}
              className="pref-select"
            >
              <option value="small">አነስተኛ / Small (14px)</option>
              <option value="medium">መካከለኛ / Medium (18px)</option>
              <option value="large">ትልቅ / Large (24px)</option>
              <option value="xlarge">በጣም ትልቅ / Extra Large (30px)</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-caption-color" className="setting-label">
              የትርጉም ጽሑፍ ቀለም / Caption Contrast Palette:
            </label>
            <select
              id="pref-caption-color"
              value={preferences.captionColor}
              onChange={(e) => updatePreference('captionColor', e.target.value)}
              className="pref-select"
            >
              <option value="white_on_black">ነጭ በጥቁር / White on Black</option>
              <option value="yellow_on_black">ቢጫ በጥቁር / Yellow on Black</option>
              <option value="cyan_on_black">ሲያን በጥቁር / Cyan on Black</option>
              <option value="black_on_white">ጥቁር በነጭ / Black on White</option>
            </select>
          </div>

          <div className="setting-item checkbox-item">
            <input
              id="pref-ethsl"
              type="checkbox"
              checked={preferences.ethSLEnabled}
              onChange={(e) => updatePreference('ethSLEnabled', e.target.checked)}
              className="pref-checkbox"
            />
            <label htmlFor="pref-ethsl" className="checkbox-label">
              የምልክት ቋንቋ መስኮት ይብራ / Show Ethiopian Sign Language Overlay by Default
            </label>
          </div>
        </fieldset>

        {/* Section 3: Audio Descriptions & Motor Controls */}
        <fieldset className="settings-group">
          <legend className="group-legend">የድምፅ እና የቁልፍ ሰሌዳ / Audio & Navigation</legend>

          <div className="setting-item checkbox-item">
            <input
              id="pref-ad"
              type="checkbox"
              checked={preferences.audioDescriptionEnabled}
              onChange={(e) => updatePreference('audioDescriptionEnabled', e.target.checked)}
              className="pref-checkbox"
            />
            <label htmlFor="pref-ad" className="checkbox-label">
              የማየት ማብራሪያ ድምፅ / Enable Audio Description Tracks
            </label>
          </div>

          <div className="setting-item shortcuts-guide">
            <strong className="setting-label">የቁልፍ ሰሌዳ መቆጣጠሪያዎች / Keyboard Navigation:</strong>
            <ul className="shortcuts-list">
              <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd> Move focus sequentially</li>
              <li><kbd>Space</kbd> or <kbd>K</kbd> Play / Pause video</li>
              <li><kbd>J</kbd> / <kbd>L</kbd> Seek -10s / +10s</li>
              <li><kbd>C</kbd> Toggle closed captions</li>
              <li><kbd>S</kbd> Toggle sign language overlay</li>
              <li><kbd>D</kbd> Toggle audio descriptions</li>
              <li><kbd>M</kbd> Mute / Unmute</li>
            </ul>
          </div>
        </fieldset>
      </div>
    </section>
  )
}
