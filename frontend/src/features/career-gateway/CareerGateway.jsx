import { useState, useEffect } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import { fetchJobs } from '../../services/api'
import JobCard from './JobCard'
import './CareerGateway.css'

export default function CareerGateway() {
  const { t } = useAccessibility()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchJobs()
      .then((data) => {
        setJobs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter((job) => {
    if (filterType === 'all') return true
    return job.employment_type.toLowerCase().includes(filterType.toLowerCase())
  })

  return (
    <section className="career-gateway-section" aria-labelledby="career-heading">
      <div className="career-header">
        <div>
          <h2 id="career-heading" className="career-title">
            {t.careers.title}
          </h2>
          <p className="career-subtitle">
            {t.careers.subtitle}
          </p>
        </div>

        {/* Filter controls */}
        <div className="career-filters">
          <label htmlFor="job-filter" className="sr-only">Filter by employment type</label>
          <select
            id="job-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t.careers.filterAll}</option>
            <option value="full-time">{t.careers.filterFullTime}</option>
            <option value="contract">{t.careers.filterContract}</option>
            <option value="remote">{t.careers.filterRemote}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>{t.careers.loadingJobs}</p>
      ) : filteredJobs.length === 0 ? (
        <p>{t.careers.noListings}</p>
      ) : (
        <div className="jobs-list" role="list">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  )
}
