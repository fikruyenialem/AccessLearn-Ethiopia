import pytest
from decimal import Decimal
from app.models.course import Course
from app.models.job import Job
from app.models.certificate import Certificate


def test_auth_registration_and_login(client):
    reg_payload = {
        "email": "newlearner@accesslearn.et",
        "full_name": "Kidus Solomon",
        "password": "SecurePassword2026!",
        "role": "learner",
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newlearner@accesslearn.et"

    # Duplicate registration should be rejected
    res_dup = client.post("/api/v1/auth/register", json=reg_payload)
    assert res_dup.status_code == 400

    # Successful login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "newlearner@accesslearn.et", "password": "SecurePassword2026!"},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Invalid login
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": "newlearner@accesslearn.et", "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401


def test_list_and_get_courses(client, db_session):
    res = client.get("/api/v1/courses")
    assert res.status_code == 200
    courses = res.json()
    assert len(courses) >= 1

    first_course_id = courses[0]["id"]
    detail_res = client.get(f"/api/v1/courses/{first_course_id}")
    assert detail_res.status_code == 200
    course_data = detail_res.json()
    assert "lessons" in course_data
    assert len(course_data["lessons"]) >= 1


def test_lesson_detail_and_offline_pack(client, db_session):
    courses_res = client.get("/api/v1/courses")
    first_course_id = courses_res.json()[0]["id"]
    course_detail = client.get(f"/api/v1/courses/{first_course_id}").json()
    lesson_id = course_detail["lessons"][0]["id"]

    # Lesson detail
    lesson_res = client.get(f"/api/v1/lessons/{lesson_id}")
    assert lesson_res.status_code == 200
    lesson_data = lesson_res.json()
    assert "media_assets" in lesson_data

    # Offline pack
    offline_res = client.get(f"/api/v1/lessons/{lesson_id}/offline-pack")
    assert offline_res.status_code == 200
    offline_pack = offline_res.json()
    assert offline_pack["lesson_id"] == lesson_id
    assert "media_assets" in offline_pack
    assert "content_html" in offline_pack


def test_lesson_progress_update(client, db_session):
    courses_res = client.get("/api/v1/courses")
    lesson_id = courses_res.json()[0]["lessons"][0]["id"] if "lessons" in courses_res.json()[0] else None
    if not lesson_id:
        course_detail = client.get(f"/api/v1/courses/{courses_res.json()[0]['id']}").json()
        lesson_id = course_detail["lessons"][0]["id"]

    progress_payload = {
        "completion_percentage": "85.50",
        "last_position": "120.00",
    }
    res = client.post(f"/api/v1/lessons/{lesson_id}/progress", json=progress_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["recorded_locally", "synchronized"]


def test_career_gateway_jobs(client):
    res = client.get("/api/v1/jobs")
    assert res.status_code == 200
    jobs = res.json()
    assert len(jobs) >= 1
    assert "accommodations" in jobs[0]
    assert "audio_summary" in jobs[0]


def test_certificate_verification(client):
    res = client.get("/api/v1/certificates/verify/AL-2026-ETH-9821")
    assert res.status_code == 200
    cert_data = res.json()
    assert cert_data["is_valid"] is True
    assert cert_data["verification_code"] == "AL-2026-ETH-9821"

    # Non-existent code
    bad_res = client.get("/api/v1/certificates/verify/NON-EXISTENT-CODE")
    assert bad_res.status_code == 404


def test_accessibility_preferences(client):
    get_res = client.get("/api/v1/preferences")
    assert get_res.status_code == 200
    prefs = get_res.json()
    assert "caption_size" in prefs

    put_res = client.put(
        "/api/v1/preferences",
        json={"caption_size": "large", "contrast_mode": "high_contrast"},
    )
    assert put_res.status_code == 200
    updated_prefs = put_res.json()
    assert updated_prefs["caption_size"] == "large"
    assert updated_prefs["contrast_mode"] == "high_contrast"


def test_savanna_integration_endpoints(client):
    status_res = client.get("/api/v1/integrations/savanna/status")
    assert status_res.status_code == 200
    assert status_res.json()["savanna_compatible"] is True

    courses_res = client.get("/api/v1/integrations/savanna/courses")
    assert courses_res.status_code == 200
    assert isinstance(courses_res.json(), list)
