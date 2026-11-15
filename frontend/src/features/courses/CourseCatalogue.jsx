import { useAccessibility } from '../../context/AccessibilityContext'
import './CourseCatalogue.css'

export default function CourseCatalogue({ courses, onSelectCourse }) {
  const { t } = useAccessibility()

  return (
    <section className="course-catalogue" aria-labelledby="catalogue-title">
      <div className="catalogue-header">
        <h2 id="catalogue-title" className="catalogue-title">
          {t.catalogue.title}
        </h2>
        <p className="catalogue-subtitle">
          {t.catalogue.subtitle}
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
                  {course.source === 'savanna' ? t.catalogue.sourceAlx : t.catalogue.sourceCore}
                </span>
                <span className="eyebrow-divider">&bull;</span>
                <span className="level-label">{course.level} {t.catalogue.level}</span>
                <span className="eyebrow-divider">&bull;</span>
                <span className="lang-label">{t.catalogue.bilingualTag}</span>
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
                  aria-label={`${t.catalogue.openLessons}: ${course.title}`}
                >
                  {t.catalogue.openLessons} &rarr;
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
