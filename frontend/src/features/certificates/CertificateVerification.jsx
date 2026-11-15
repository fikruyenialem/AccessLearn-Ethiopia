import { useState } from 'react'
import { verifyCertificate } from '../../services/api'
import './CertificateVerification.css'

export default function CertificateVerification() {
  const [code, setCode] = useState('AL-2026-ETH-9821')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await verifyCertificate(code.trim())
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="cert-verification-section" aria-labelledby="cert-heading">
      <div className="cert-header">
        <h2 id="cert-heading" className="cert-title">
          የምስክር ወረቀት ማረጋገጫ / Verifiable Certificate Registry
        </h2>
        <p className="cert-subtitle">
          Verify authentic completion credentials issued to learners for accessible media mastery.
        </p>
      </div>

      <div className="cert-search-card">
        <form onSubmit={handleVerify} className="cert-form">
          <label htmlFor="cert-code-input" className="cert-input-label">
            የማረጋገጫ ኮድ / Certificate Verification Code:
          </label>
          <div className="cert-input-row">
            <input
              id="cert-code-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. AL-2026-ETH-9821"
              className="cert-input"
              required
            />
            <button
              type="submit"
              className="verify-submit-btn"
              disabled={loading}
              aria-label="Verify Certificate Code"
            >
              {loading ? 'Checking...' : 'አረጋግጥ / Verify'}
            </button>
          </div>
          <span className="cert-hint">Sample demonstration code: <code>AL-2026-ETH-9821</code></span>
        </form>
      </div>

      {error && (
        <div className="cert-result-error" role="alert">
          <div>
            <strong>Notice:</strong> {error}
          </div>
        </div>
      )}

      {result && (
        <div className="cert-display-card" role="region" aria-label="Verified Certificate Credentials">
          <div className="cert-card-inner">
            <div className="cert-card-header">
              <div className="cert-institution-mark">
                <span className="inst-title">ACCESSLEARN ETHIOPIA</span>
                <span className="inst-sub">Educational Media Accessibility Credential</span>
              </div>
              <span className="verified-status">Official Verified Record</span>
            </div>

            <div className="cert-body">
              <p className="cert-preamble">This official record certifies that</p>
              <h3 className="cert-recipient">{result.recipient_name}</h3>
              <p className="cert-conferral">has demonstrated proficiency and completed all curriculum requirements for</p>
              <h4 className="cert-course-name">{result.course_title}</h4>

              <div className="cert-metadata-table">
                <div className="meta-row">
                  <span className="meta-label">Credential ID</span>
                  <span className="meta-val font-mono">{result.verification_code}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Issuing Authority</span>
                  <span className="meta-val">{result.issuer}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date Issued</span>
                  <span className="meta-val">{new Date(result.issued_at).toLocaleDateString()}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Accessibility Standard</span>
                  <span className="meta-val">WCAG 2.2 Level AA Validated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
