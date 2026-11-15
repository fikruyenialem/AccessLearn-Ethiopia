import './CourseCatalogue.css'

export default function CourseCatalogue({ courses, onSelectCourse }) {
  return (
    <section className="course-catalogue" aria-labelledby="catalogue-title">
      <div className="catalogue-header">
        <h2 id="catalogue-title" className="catalogue-title">
          የትምህርት ካታሎግ / Accessible Curriculum
        </h2>
        <p className="catalogue-subtitle">
          Structured learning units engineered for Deaf, blind, low-vision, and 2G/3G mobile learners.
        </p>
      </div>

      <div className="courses-list" role="list">
        {courses.map((course) => (
          <article
            key={course.id}
            className="course-entry"
            role="listitem"
            aria-labelledby={`course-title-${course.id}`}
          >
            <div className="course-media-frame">
              <img
                src={course.thumbnail}
                alt=""
                aria-hidden="true"
                className="course-image"
                loading="lazy"
              />
            </div>

            <div className="course-content">
              <div className="course-eyebrow">
                <span className="source-label">
                  {course.source === 'savanna' ? 'ALX Savanna Platform' : 'AccessLearn Core'}
                </span>
                <span className="eyebrow-divider">&bull;</span>
                <span className="level-label">{course.level} Level</span>
                <span className="eyebrow-divider">&bull;</span>
                <span className="lang-label">Bilingual (English &amp; Amharic)</span>
              </div>

              <h3 id={`course-title-${course.id}`} className="course-heading">
                {course.title}
              </h3>

              <p className="course-description">{course.description}</p>

              <div className="course-action-row">
                <button
                  type="button"
                  className="open-course-btn"
                  onClick={() => onSelectCourse(course.id)}
                  aria-label={`Open course lessons for ${course.title}`}
                >
                  ትምህርቶችን ክፈት / Open Lessons &rarr;
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
