import { useAccessibility } from '../../context/AccessibilityContext'
import './AccessibilityPanel.css'

export default function AccessibilityPanel() {
  const { preferences, updatePreference, resetPreferences, t } = useAccessibility()

  return (
    <section className="access-panel-section" aria-labelledby="settings-heading">
      <div className="panel-header">
        <div>
          <h2 id="settings-heading" className="panel-title">
            {t.settings.title}
          </h2>
          <p className="panel-subtitle">
            {t.settings.subtitle}
          </p>
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={resetPreferences}
          aria-label="Reset all accessibility preferences to defaults"
        >
          {t.settings.resetBtn}
        </button>
      </div>

      <div className="settings-grid">
        {/* Section 1: Vision & Contrast */}
        <fieldset className="settings-group">
          <legend className="group-legend">{t.settings.visionLegend}</legend>

          <div className="setting-item">
            <label htmlFor="pref-text-scale" className="setting-label">
              {t.settings.textScaleLabel} ({Math.round(preferences.textScale * 100)}%):
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
              {t.settings.contrastLabel}:
            </label>
            <select
              id="pref-contrast"
              value={preferences.contrast}
              onChange={(e) => updatePreference('contrast', e.target.value)}
              className="pref-select"
            >
              <option value="normal">{t.settings.contrastNormal}</option>
              <option value="high">{t.settings.contrastHigh}</option>
              <option value="monochrome">{t.settings.contrastMonochrome}</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-theme" className="setting-label">
              {t.settings.themeLabel}:
            </label>
            <select
              id="pref-theme"
              value={preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value)}
              className="pref-select"
            >
              <option value="light">{t.settings.themeLight}</option>
              <option value="dark">{t.settings.themeDark}</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-color-vision" className="setting-label">
              {t.settings.colorVisionLabel}:
            </label>
            <select
              id="pref-color-vision"
              value={preferences.colorVision}
              onChange={(e) => updatePreference('colorVision', e.target.value)}
              className="pref-select"
            >
              <option value="none">{t.settings.colorVisionNone}</option>
              <option value="protanopia_deuteranopia">{t.settings.colorVisionProtanopia}</option>
              <option value="tritanopia">{t.settings.colorVisionTritanopia}</option>
            </select>
          </div>
        </fieldset>

        {/* Section 2: Captions & Hearing */}
        <fieldset className="settings-group">
          <legend className="group-legend">{t.settings.hearingLegend}</legend>

          <div className="setting-item checkbox-item">
            <input
              id="pref-captions"
              type="checkbox"
              checked={preferences.captionsEnabled}
              onChange={(e) => updatePreference('captionsEnabled', e.target.checked)}
              className="pref-checkbox"
            />
            <label htmlFor="pref-captions" className="checkbox-label">
              {t.settings.enableCaptionsLabel}
            </label>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-caption-lang" className="setting-label">
              {t.settings.captionLangLabel}:
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
              {t.settings.captionSizeLabel}:
            </label>
            <select
              id="pref-caption-size"
              value={preferences.captionSize}
              onChange={(e) => updatePreference('captionSize', e.target.value)}
              className="pref-select"
            >
              <option value="small">{t.settings.sizeSmall}</option>
              <option value="medium">{t.settings.sizeMedium}</option>
              <option value="large">{t.settings.sizeLarge}</option>
              <option value="xlarge">{t.settings.sizeXLarge}</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="pref-caption-color" className="setting-label">
              {t.settings.captionColorLabel}:
            </label>
            <select
              id="pref-caption-color"
              value={preferences.captionColor}
              onChange={(e) => updatePreference('captionColor', e.target.value)}
              className="pref-select"
            >
              <option value="white_on_black">{t.settings.colorWhiteOnBlack}</option>
              <option value="yellow_on_black">{t.settings.colorYellowOnBlack}</option>
              <option value="cyan_on_black">{t.settings.colorCyanOnBlack}</option>
              <option value="black_on_white">{t.settings.colorBlackOnWhite}</option>
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
              {t.settings.enableEthslLabel}
            </label>
          </div>
        </fieldset>

        {/* Section 3: Audio Descriptions & Motor Controls */}
        <fieldset className="settings-group">
          <legend className="group-legend">{t.settings.audioLegend}</legend>

          <div className="setting-item checkbox-item">
            <input
              id="pref-ad"
              type="checkbox"
              checked={preferences.audioDescriptionEnabled}
              onChange={(e) => updatePreference('audioDescriptionEnabled', e.target.checked)}
              className="pref-checkbox"
            />
            <label htmlFor="pref-ad" className="checkbox-label">
              {t.settings.enableAdLabel}
            </label>
          </div>

          <div className="setting-item shortcuts-guide">
            <strong className="setting-label">{t.settings.keyboardShortcutsLabel}</strong>
            <ul className="shortcuts-list">
              <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd> {t.settings.tabShortcut}</li>
              <li><kbd>Space</kbd> / <kbd>K</kbd> {t.settings.spaceShortcut}</li>
              <li><kbd>J</kbd> / <kbd>L</kbd> {t.settings.seekShortcut}</li>
              <li><kbd>C</kbd> {t.settings.cShortcut}</li>
              <li><kbd>S</kbd> {t.settings.sShortcut}</li>
              <li><kbd>D</kbd> {t.settings.dShortcut}</li>
              <li><kbd>M</kbd> {t.settings.mShortcut}</li>
            </ul>
          </div>
        </fieldset>
      </div>
    </section>
  )
}
