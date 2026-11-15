import uuid
from decimal import Decimal
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database.session import SessionLocal, engine, Base
from app.models.user import User, AccessibilityPreference
from app.models.course import Course
from app.models.lesson import Lesson, MediaAsset
from app.models.enrollment import Enrollment, LearningProgress
from app.models.job import Job
from app.models.certificate import Certificate


def seed_database(db: Session) -> None:
    """Populate database with initial authentic accessible learning media and career data."""
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)

    # Check if data already exists
    if db.query(User).filter(User.email == "instructor@accesslearn.et").first():
        return

    # 1. Create Instructor & Learner
    instructor = User(
        id=uuid.uuid4(),
        full_name="Abebe Bekele",
        email="instructor@accesslearn.et",
        password_hash=get_password_hash("Password123!"),
        role="instructor",
    )
    db.add(instructor)

    learner = User(
        id=uuid.uuid4(),
        full_name="Tigist Haile",
        email="learner@accesslearn.et",
        password_hash=get_password_hash("Password123!"),
        role="learner",
    )
    db.add(learner)
    db.flush()

    # Learner Accessibility Preferences
    learner_prefs = AccessibilityPreference(
        id=uuid.uuid4(),
        user_id=learner.id,
        preferred_language="am",
        caption_enabled=True,
        caption_size="medium",
        caption_color="yellow_on_black",
        contrast_mode="normal",
        text_scale=Decimal("1.15"),
    )
    db.add(learner_prefs)

    # 2. Courses
    course_1 = Course(
        id=uuid.uuid4(),
        instructor_id=instructor.id,
        title="Accessible Digital Media & Web Engineering",
        description=(
            "Learn how to build inclusive, accessible digital learning media compliant with "
            "WCAG 2.2 Level AA. Covers captioning, sign-language synchronization, audio description, "
            "and low-bandwidth offline packaging for learners across Ethiopia."
        ),
        level="Beginner",
        thumbnail="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        source="internal",
    )
    db.add(course_1)

    course_2 = Course(
        id=uuid.uuid4(),
        instructor_id=instructor.id,
        title="Digital Skills for Low-Bandwidth & 3G Environments",
        description=(
            "Practical skills for developing lightweight HTML platforms, data-efficient audio lectures, "
            "and offline caching mechanisms for learners using limited 2G/3G connectivity."
        ),
        level="Intermediate",
        thumbnail="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
        source="savanna",
        external_id="savanna-crs-7702",
    )
    db.add(course_2)
    db.flush()

    # 3. Lessons for Course 1
    lesson_1 = Lesson(
        id=uuid.uuid4(),
        course_id=course_1.id,
        title="Introduction to Accessible Learning Media & AccessPlayer",
        description="Understanding multimodal digital media: captions, transcripts, sign language overlays, and audio descriptions.",
        content_html="""
        <article class="accessible-lesson-content">
            <h2>Welcome to AccessLearn Ethiopia</h2>
            <p>Inclusive digital education ensures that every learner has equal access to knowledge, regardless of hearing, vision, motor abilities, or network connectivity constraints.</p>
            
            <h3>Key Principles of Universal Learning Design</h3>
            <ul>
                <li><strong>Multiple Means of Representation:</strong> Video accompanied by captions, transcripts, audio descriptions, and Ethiopian Sign Language (EthSL).</li>
                <li><strong>Multiple Means of Navigation:</strong> Complete keyboard accessibility, clear focus rings, and screen-reader semantics.</li>
                <li><strong>Resilient Connectivity:</strong> Downloadable offline learning packs designed for 2G/3G connections.</li>
            </ul>
        </article>
        """,
        sequence_number=1,
        estimated_duration=12,
    )
    db.add(lesson_1)

    lesson_2 = Lesson(
        id=uuid.uuid4(),
        course_id=course_1.id,
        title="Ethiopian Sign Language (EthSL) & Synchronized Captions",
        description="How to integrate synchronized EthSL video overlays and bilingual Amharic-English closed caption tracks.",
        content_html="""
        <article class="accessible-lesson-content">
            <h2>Ethiopian Sign Language Integration</h2>
            <p>EthSL is the primary language of Deaf communities across Ethiopia. Providing a resizable, movable picture-in-picture interpreter window allows Deaf learners to absorb technical lecture material naturally.</p>
        </article>
        """,
        sequence_number=2,
        estimated_duration=15,
    )
    db.add(lesson_2)
    db.flush()

    # 4. Media Assets for Lesson 1
    media_assets = [
        MediaAsset(
            id=uuid.uuid4(),
            lesson_id=lesson_1.id,
            media_type="video",
            language="en",
            storage_reference="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            format="mp4",
            file_size=5500000,
            verified=True,
        ),
        MediaAsset(
            id=uuid.uuid4(),
            lesson_id=lesson_1.id,
            media_type="caption",
            language="en",
            storage_reference="captions_en_lesson1.vtt",
            format="vtt",
            file_size=2800,
            verified=True,
        ),
        MediaAsset(
            id=uuid.uuid4(),
            lesson_id=lesson_1.id,
            media_type="caption",
            language="am",
            storage_reference="captions_am_lesson1.vtt",
            format="vtt",
            file_size=3200,
            verified=True,
        ),
        MediaAsset(
            id=uuid.uuid4(),
            lesson_id=lesson_1.id,
            media_type="sign_language",
            language="am",
            storage_reference="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            format="mp4",
            file_size=3100000,
            verified=True,
        ),
        MediaAsset(
            id=uuid.uuid4(),
            lesson_id=lesson_1.id,
            media_type="audio_description",
            language="en",
            storage_reference="https://actions.google.com/sounds/v1/speech/voice_over_sample.mp3",
            format="mp3",
            file_size=850000,
            verified=True,
        ),
    ]
    for ma in media_assets:
        db.add(ma)

    # 5. Enrollments & Progress
    enrollment = Enrollment(
        id=uuid.uuid4(),
        user_id=learner.id,
        course_id=course_1.id,
        status="active",
    )
    db.add(enrollment)

    progress = LearningProgress(
        id=uuid.uuid4(),
        user_id=learner.id,
        lesson_id=lesson_1.id,
        status="completed",
        completion_percentage=Decimal("100.00"),
        last_position=Decimal("180.50"),
    )
    db.add(progress)

    # 6. Career Gateway Jobs
    jobs = [
        Job(
            id=uuid.uuid4(),
            title="Accessible Web & Frontend Developer",
            organization="Ethio Telecom Digital Innovation Labs",
            location="Addis Ababa, Ethiopia (Hybrid / Remote Option)",
            employment_type="Full-time",
            description=(
                "Join our digital accessibility engineering team building accessible public services for millions "
                "of citizens. You will develop screen-reader accessible user interfaces, implement WCAG 2.2 AA standards, "
                "and optimize digital products for low-bandwidth mobile devices across Ethiopia."
            ),
            requirements="Demonstrated experience with React, semantic HTML, ARIA standards, keyboard navigation, and responsive CSS.",
            accommodations="Screen-reader friendly recruitment process, flexible hours, ergonomic assistive workstations, and Ethiopian Sign Language interpreter support.",
            application_url="https://ethiotelecom.et/careers/accessible-developer-2026",
            audio_summary=(
                "Ethio Telecom is hiring a full-time Accessible Web and Frontend Developer in Addis Ababa or hybrid remote. "
                "The role focuses on building WCAG 2.2 AA interfaces for nationwide public services. "
                "Accommodations include screen-reader friendly interview steps, flexible hours, and sign language interpreter support."
            ),
        ),
        Job(
            id=uuid.uuid4(),
            title="Digital Accessibility & Inclusion Coordinator",
            organization="Ethiopian National Association of the Deaf (ENAD)",
            location="Addis Ababa, Lideta Tech Hub",
            employment_type="Full-time",
            description=(
                "Lead community digital literacy initiatives, coordinate Ethiopian Sign Language educational video recordings, "
                "and evaluate digital learning software for Deaf and hard-of-hearing learners."
            ),
            requirements="Fluency in Ethiopian Sign Language (EthSL) and Amharic. Familiarity with video captioning and educational media.",
            accommodations="Deaf-led working environment, visual fire alarms and notification systems, and bilingual EthSL/written Amharic communication.",
            application_url="https://enad.org.et/vacancies/accessibility-coordinator",
            audio_summary=(
                "The Ethiopian National Association of the Deaf is hiring a Digital Accessibility and Inclusion Coordinator "
                "at Lideta Tech Hub in Addis Ababa. The role coordinates sign language media production and accessibility evaluation. "
                "Deaf-led workplace with visual alerting systems and bilingual EthSL support."
            ),
        ),
        Job(
            id=uuid.uuid4(),
            title="Low-Bandwidth UX & Assistive Tech Specialist",
            organization="Digital Bridge Africa Foundation",
            location="Remote / Addis Ababa, Ethiopia",
            employment_type="Contract (12 Months)",
            description=(
                "Research, design, and validate offline-first learning experiences for rural students using 2G/3G mobile networks. "
                "Test usability with blind, low-vision, and motor-impaired learners."
            ),
            requirements="Experience in UX testing with assistive technologies (NVDA, TalkBack), progressive web apps, and low-connectivity design.",
            accommodations="100% remote flexibility, text-first asynchronous team communication, and full assistive software sponsorship.",
            application_url="https://digitalbridgeafrica.org/join/ux-specialist",
            audio_summary=(
                "Digital Bridge Africa Foundation is hiring a Low-Bandwidth UX and Assistive Tech Specialist for a 12-month contract. "
                "Work is 100% remote with text-first communication and assistive software provided. "
                "Focuses on testing offline-first educational solutions with learners with disabilities."
            ),
        ),
    ]
    for j in jobs:
        db.add(j)

    # 7. Verifiable Certificate
    cert = Certificate(
        id=uuid.uuid4(),
        user_id=learner.id,
        course_id=course_1.id,
        verification_code="AL-2026-ETH-9821",
        status="valid",
    )
    db.add(cert)

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
        print("Database successfully seeded with realistic accessible learning media and career opportunities.")
    finally:
        db.close()
