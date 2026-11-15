import './Footer.css'

export default function Footer() {
  return (
    <footer role="contentinfo" className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p className="footer-title">
            <strong>ACCESSBRIDGE &bull; AccessLearn Ethiopia</strong>
          </p>
          <p className="footer-sub">
            Built for Digital Bridge Accessibility Hackathon 2026 &bull; Track 2 (Accessible Learning Media)
          </p>
          <p className="footer-quote">
            <em>"One lesson. Multiple ways to learn. No learner left behind."</em>
          </p>
        </div>

        <div className="footer-links">
          <span className="links-header">Developer & Integration:</span>
          <a href="/api/v1/docs" target="_blank" rel="noreferrer">
            Swagger API Docs (/api/v1/docs)
          </a>
          <a href="/api/v1/redoc" target="_blank" rel="noreferrer">
            ReDoc Specification
          </a>
          <a href="/api/v1/health" target="_blank" rel="noreferrer">
            Backend Health Status
          </a>
          <span className="wcag-badge">WCAG 2.2 AA Conformance Target</span>
        </div>
      </div>
    </footer>
  )
}
