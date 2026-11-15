# AccessLearn Ethiopia
## System Architecture Document

**Version:** 1.0  
**Architecture:** Modular full-stack architecture

---

## 1. Architecture Overview

AccessLearn uses a modular architecture consisting of:

1. React frontend.
2. Python FastAPI backend.
3. PostgreSQL database.
4. Media storage.
5. Progressive Web Application (PWA) offline layer.
6. Savanna integration adapter.

The frontend communicates with the backend through versioned REST APIs.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build tool | Vite |
| Language | JavaScript |
| Styling | CSS |
| Backend | Python |
| Backend framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| API format | REST / JSON |
| Offline storage | IndexedDB |
| Offline caching | Service Workers |
| Authentication | JWT-based authentication |
| Version control | Git and GitHub |

## 3. Frontend Architecture

The frontend is responsible for user interaction, presentation and accessible navigation.

Main features:

- Authentication.
- Learning dashboard.
- Course catalogue.
- Lesson pages.
- AccessPlayer.
- Accessibility preferences.
- Offline learning.
- Career Gateway.
- Certificates.

The application will use feature-based organization.

### Frontend directory structure

```text
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── features/
    │   ├── authentication/
    │   ├── dashboard/
    │   ├── courses/
    │   ├── access-player/
    │   ├── accessibility/
    │   ├── offline-learning/
    │   ├── career-gateway/
    │   └── certificates/
    ├── services/
    ├── hooks/
    ├── context/
    ├── styles/
    ├── App.jsx
    └── main.jsx
```

## 4. Backend Architecture

The backend handles application logic, data access, security and external integrations.

Main responsibilities:

- User authentication.
- User profiles.
- Course retrieval.
- Lesson delivery.
- Learning progress.
- Assessments.
- Certificates.
- Career opportunities.
- Savanna integration.

### Backend directory structure

```text
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── database/
│   ├── integrations/
│   │   └── savanna/
│   └── main.py
├── tests/
└── requirements.txt
```

## 5. Database Architecture

PostgreSQL will serve as the primary relational database.

SQLAlchemy will provide database access and ORM functionality.

The database will contain:

- Users.
- Accessibility preferences.
- Courses.
- Lessons.
- Media assets.
- Enrollments.
- Learning progress.
- Assessments.
- Certificates.
- Jobs.

Media files should be stored separately from relational database records. The database stores media metadata and approved storage references.

## 6. AccessPlayer Architecture

AccessPlayer is a reusable accessible multimedia player.

Its main components:

- Video surface.
- Playback controls.
- Caption manager.
- Caption settings.
- Sign-language interpreter window.
- Audio description controls.
- Transcript panel.
- Keyboard controls.

It should support independently configured media tracks.

Missing optional media must not prevent access to the lesson through other available alternatives.

## 7. Offline Architecture

The offline layer will use:

- Service Workers for application resource caching.
- IndexedDB for structured offline data.
- Cache Storage for suitable static resources.
- Downloadable lesson packages.
- A synchronization queue for offline progress updates.

Offline behavior must distinguish between content that is available offline and content requiring a live connection.

Conflicting progress updates must be handled safely.

## 8. Savanna Integration Architecture

A dedicated integration adapter will isolate Savanna-specific communication from the rest of the application.

Responsibilities:

- Connect through approved Savanna mechanisms.
- Map external course data to internal course structures.
- Handle authentication or authorization according to supported mechanisms.
- Synchronize progress when permitted.
- Handle connection failures.

The implementation depends on verified Savanna documentation, permissions and available interfaces.

The application must remain independently usable when the integration is unavailable.

## 9. API Architecture

All internal API routes will use the `/api/v1/` prefix.

Main endpoint groups:

- `/auth`
- `/users`
- `/courses`
- `/lessons`
- `/media`
- `/enrollments`
- `/progress`
- `/assessments`
- `/jobs`
- `/certificates`
- `/integrations/savanna`

Detailed request and response contracts will be documented separately.

## 10. Security Architecture

- Use secure password hashing.
- Protect private API endpoints.
- Validate incoming data.
- Enforce authorization.
- Avoid exposing sensitive learner data.
- Use HTTPS in deployment.
- Store secrets in environment variables.
- Avoid storing authentication secrets in unsafe browser storage.
- Protect offline learner data appropriately.

## 11. Error Handling

The application should handle:

- Network failure.
- Missing content.
- Invalid authentication.
- Unauthorized access.
- Media loading failure.
- Offline synchronization failure.
- External integration failure.

Errors must be understandable and accessible to assistive technologies.

## 12. Architectural Principles

1. Accessibility first.
2. Modular development.
3. Separation of concerns.
4. Reusable components.
5. Offline-aware design.
6. Secure data handling.
7. Documented interfaces.
8. Graceful degradation.
9. Testable functionality.
10. Integration through clearly defined contracts.

