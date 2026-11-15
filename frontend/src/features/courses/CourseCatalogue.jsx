import './CourseCatalogue.css'

export default function CourseCatalogue({ courses, onSelectCourse }) {
  return (
    <section className="course-catalogue" aria-labelledby="catalogue-title">
      <div className="catalogue-header">
        <div>
          <h2 id="catalogue-title" className="catalogue-title">
            የትምህርት ካታሎግ / Accessible Course Catalogue
          </h2>
          <p className="catalogue-subtitle">
            Curriculum units engineered for Deaf, blind, low-vision, and low-bandwidth learners.
          </p>
        </div>
      </div>

      <div className="courses-grid" role="list">
        {courses.map((course) => (
          <article
            key={course.id}
            className="course-card"
            role="listitem"
            aria-labelledby={`course-title-${course.id}`}
          >
            <div className="course-thumb-wrap">
              <img
                src={course.thumbnail}
                alt={`Cover for ${course.title}`}
                className="course-thumb"
                loading="lazy"
              />
              <span className={`course-source-badge ${course.source}`}>
                {course.source === 'savanna' ? 'ALX Savanna' : 'AccessLearn Core'}
              </span>
            </div>

            <div className="course-card-body">
              <div className="course-meta">
                <span className="course-level-badge">{course.level}</span>
                <span className="course-lang-tag">Amharic + English</span>
              </div>

              <h3 id={`course-title-${course.id}`} className="course-card-title">
                {course.title}
              </h3>

              <p className="course-card-desc">{course.description}</p>

              <div className="course-card-footer">
                <button
                  type="button"
                  className="start-course-btn"
                  onClick={() => onSelectCourse(course.id)}
                  aria-label={`Open course: ${course.title}`}
                >
                  ተማር / Open Lessons →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
