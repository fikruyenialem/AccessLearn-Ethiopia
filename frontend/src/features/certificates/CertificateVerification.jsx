import { useState } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import { verifyCertificate } from '../../services/api'
import './CertificateVerification.css'

export default function CertificateVerification() {
  const { t } = useAccessibility()
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
          {t.certificates.title}
        </h2>
        <p className="cert-subtitle">
          {t.certificates.subtitle}
        </p>
      </div>

      <div className="cert-search-card">
        <form onSubmit={handleVerify} className="cert-form">
          <label htmlFor="cert-code-input" className="cert-input-label">
            {t.certificates.inputLabel}
          </label>
          <div className="cert-input-row">
            <input
              id="cert-code-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.certificates.inputPlaceholder}
              className="cert-input"
              required
            />
            <button
              type="submit"
              className="verify-submit-btn"
              disabled={loading}
              aria-label="Verify Certificate Code"
            >
              {loading ? t.certificates.checkingBtn : t.certificates.verifyBtn}
            </button>
          </div>
          <span className="cert-hint">
            {t.certificates.sampleHint.split('AL-2026-ETH-9821')[0]}
            <code>AL-2026-ETH-9821</code>
          </span>
        </form>
      </div>

      {error && (
        <div className="cert-result-error" role="alert">
          <div>
            <strong>{t.common.notice}:</strong> {error}
          </div>
        </div>
      )}

      {result && (
        <div className="cert-display-card" role="region" aria-label="Verified Certificate Credentials">
          <div className="cert-card-inner">
            <div className="cert-card-header">
              <div className="cert-institution-mark">
                <span className="inst-title">{t.certificates.instTitle}</span>
                <span className="inst-sub">{t.certificates.instSub}</span>
              </div>
              <span className="verified-status">{t.certificates.verifiedStatus}</span>
            </div>

            <div className="cert-body">
              <p className="cert-preamble">{t.certificates.certPreamble}</p>
              <h3 className="cert-recipient">{result.recipient_name}</h3>
              <p className="cert-conferral">{t.certificates.certConferral}</p>
              <h4 className="cert-course-name">{result.course_title}</h4>

              <div className="cert-metadata-table">
                <div className="meta-row">
                  <span className="meta-label">{t.certificates.colCredentialId}</span>
                  <span className="meta-val font-mono">{result.verification_code}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">{t.certificates.colIssuer}</span>
                  <span className="meta-val">{result.issuer}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">{t.certificates.colDateIssued}</span>
                  <span className="meta-val">{new Date(result.issued_at).toLocaleDateString()}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">{t.certificates.colStandard}</span>
                  <span className="meta-val">{t.certificates.standardVal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
