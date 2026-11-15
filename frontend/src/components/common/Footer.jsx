import { useAccessibility } from '../../context/AccessibilityContext'
import './Footer.css'

export default function Footer() {
  const { t } = useAccessibility()

  return (
    <footer role="contentinfo" className="app-footer">
      <div className="footer-inner">
        <div className="footer-colophon">
          <h4 className="colophon-title">{t.footer.colophonTitle}</h4>
          <p className="colophon-text">{t.footer.colophonText}</p>
          <p className="colophon-motto">{t.footer.colophonMotto}</p>
        </div>

        <div className="footer-section">
          <h5 className="section-title">{t.footer.standardsTitle}</h5>
          <ul className="footer-list">
            <li>{t.footer.stdWcag}</li>
            <li>{t.footer.stdAria}</li>
            <li>{t.footer.stdCaptions}</li>
            <li>{t.footer.stdEthsl}</li>
            <li>{t.footer.stdOffline}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h5 className="section-title">{t.footer.integrationTitle}</h5>
          <ul className="footer-list">
            <li>
              <a href="/api/v1/docs" target="_blank" rel="noreferrer">
                {t.footer.swaggerLink}
              </a>
            </li>
            <li>
              <a href="/api/v1/redoc" target="_blank" rel="noreferrer">
                {t.footer.redocLink}
              </a>
            </li>
            <li>
              <a href="/api/v1/integrations/savanna/embed.js" target="_blank" rel="noreferrer">
                {t.footer.savannaLink}
              </a>
            </li>
            <li>
              <a href="/api/v1/health" target="_blank" rel="noreferrer">
                {t.footer.healthLink}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.location}</span>
        </div>
      </div>
    </footer>
  )
}
