import { useState, useEffect } from 'react'
import { fetchJobs } from '../../services/api'
import JobCard from './JobCard'
import './CareerGateway.css'

export default function CareerGateway() {
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
            የሥራ ዕድሎች መድረክ / Accessible Career Gateway
          </h2>
          <p className="career-subtitle">
            Verified technology and inclusive educational employment opportunities with explicit accessibility accommodations.
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
            <option value="all">ሁሉም የሥራ ዓይነቶች / All Types</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote / Hybrid</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading career opportunities...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No listings match the selected filter.</p>
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
