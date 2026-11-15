import './Footer.css'

export default function Footer() {
  return (
    <footer role="contentinfo" className="app-footer">
      <div className="footer-inner">
        <div className="footer-colophon">
          <h4 className="colophon-title">ACCESSBRIDGE &bull; AccessLearn Ethiopia</h4>
          <p className="colophon-text">
            An open educational accessibility platform engineered for Ethiopian learners, educators, and institutions.
            Developed for the Digital Bridge Accessibility Hackathon 2026 (Track 2: Accessible Learning Media).
          </p>
          <p className="colophon-motto">
            &ldquo;One lesson. Multiple sensory pathways. No learner left behind.&rdquo;
          </p>
        </div>

        <div className="footer-section">
          <h5 className="section-title">Standards & Conformance</h5>
          <ul className="footer-list">
            <li>WCAG 2.2 Level AA Accessibility Target</li>
            <li>WAI-ARIA 1.2 Interactive Semantics</li>
            <li>Bilingual Captions (Amharic & English)</li>
            <li>Synchronized EthSL Sign Language Overlays</li>
            <li>Resilient 3G IndexedDB Offline Storage</li>
          </ul>
        </div>

        <div className="footer-section">
          <h5 className="section-title">Developer & LMS Integration</h5>
          <ul className="footer-list">
            <li>
              <a href="/api/v1/docs" target="_blank" rel="noreferrer">
                REST API Documentation (Swagger)
              </a>
            </li>
            <li>
              <a href="/api/v1/redoc" target="_blank" rel="noreferrer">
                OpenAPI Specification (ReDoc)
              </a>
            </li>
            <li>
              <a href="/api/v1/integrations/savanna/embed.js" target="_blank" rel="noreferrer">
                Savanna LMS Embed Script
              </a>
            </li>
            <li>
              <a href="/api/v1/health" target="_blank" rel="noreferrer">
                Backend System Health
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>&copy; 2026 AccessLearn Ethiopia &bull; Open Educational Media Commons</span>
          <span>Addis Ababa, Ethiopia</span>
        </div>
      </div>
    </footer>
  )
}
