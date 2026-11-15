# AccessLearn Ethiopia
## Project Requirements Specification

**Project:** AccessLearn Ethiopia  
**Hackathon:** Track 2  
**Version:** 1.0  
**Status:** Initial requirements baseline

---

## 1. Project Overview

AccessLearn Ethiopia is an inclusive digital learning platform designed to make online education accessible to Deaf and hard-of-hearing learners, blind and low-vision learners, and learners with slow or unreliable internet connections.

The platform combines an accessible learning management experience with reusable accessibility infrastructure called AccessPlayer.

The system will also support career opportunities, certificates, offline learning, and integration with the existing Savanna learning platform.

## 2. Problem Statement

Traditional online learning platforms frequently depend on visual content, audio instructions, mouse interactions, and reliable internet connections.

These assumptions create barriers for learners with different accessibility needs.

AccessLearn addresses these barriers by providing multiple ways to access educational content through one unified platform.

## 3. Project Objectives

1. Provide an accessible learning environment.
2. Support different learning and accessibility preferences.
3. Make educational content available under limited connectivity.
4. Provide accessible multimedia learning experiences.
5. Support learning progress tracking and assessments.
6. Connect learners with career opportunities.
7. Provide verifiable course completion certificates.
8. Integrate with the existing Savanna platform through supported mechanisms.

## 4. Target Users

### 4.1 Deaf and Hard-of-Hearing Learners
- English and Amharic captions.
- Caption customization.
- Downloadable transcripts.
- Ethiopian Sign Language (EthSL) video support.
- Visual notifications and instructions.

### 4.2 Blind and Low-Vision Learners
- Screen-reader-compatible interfaces.
- Keyboard-only navigation.
- Audio descriptions.
- Meaningful image alternatives.
- Adjustable text size and contrast.
- Accessible documents.

### 4.3 Learners with Limited Internet
- Lightweight HTML lessons.
- Downloadable learning materials.
- Offline access to downloaded lessons.
- Audio and text alternatives.
- Synchronization when connectivity returns.

## 5. Functional Requirements

### FR-01: Authentication
- Users can register and log in.
- Users can access their profiles.
- The system enforces appropriate permissions.

### FR-02: Learning Dashboard
- Display available courses.
- Display enrolled courses.
- Show learning progress.
- Provide accessible navigation.

### FR-03: Course Management
- Display course information.
- Organize courses into lessons.
- Support different learning levels.
- Allow learners to access course materials.

### FR-04: Accessible Learning Player
- Play educational videos.
- Provide accessible playback controls.
- Support English and Amharic caption tracks.
- Allow caption customization.
- Support a movable and resizable EthSL interpreter window.
- Provide audio description tracks where available.
- Provide readable transcripts.
- Support keyboard operation.

### FR-05: Accessibility Preferences
- Adjustable text size.
- Adjustable contrast and color preferences.
- Caption customization.
- Accessible navigation.
- Persistent user preferences.

### FR-06: Learning Progress
- Record lesson completion.
- Track course progress.
- Support progress synchronization.
- Display learning history.

### FR-07: Offline Learning
- Provide installable PWA functionality.
- Cache the application shell.
- Allow selected lessons to be downloaded.
- Make downloaded materials available offline.
- Synchronize saved progress when online.

### FR-08: Assessments
- Provide accessible learning activities.
- Support keyboard interaction.
- Provide understandable feedback.
- Record assessment results.

### FR-09: Career Gateway
- Display job opportunities.
- Provide accessible job descriptions.
- Include audio summaries where available.
- Support accessible application links.

### FR-10: Certificates
- Generate completion certificates.
- Provide unique verification codes.
- Allow certificate verification.

### FR-11: Savanna Integration
- Investigate supported integration mechanisms.
- Retrieve or connect approved learning content.
- Map relevant course and learner information.
- Synchronize progress only where supported and authorized.

## 6. Non-Functional Requirements

### Accessibility
- WCAG 2.2 AA is the development target.
- All essential functionality must work with a keyboard.
- Interfaces must support screen readers.
- Content must remain usable at 200% zoom.
- Color must not be the only way of communicating information.

### Performance
- Prioritize lightweight resources.
- Avoid unnecessary network requests.
- Support low-bandwidth usage.
- Optimize media delivery.

### Security
- Store passwords securely using established password hashing.
- Protect authenticated API endpoints.
- Validate user input.
- Apply role-based permissions.
- Protect personal learner information.

### Reliability
- Handle network interruptions gracefully.
- Avoid losing locally saved learning progress.
- Provide understandable error messages.

### Maintainability
- Use modular application architecture.
- Document API contracts.
- Maintain automated tests.
- Use Git for collaborative development.

## 7. Independent Learner Acceptance Scenario

A learner must be able to:

1. Open AccessLearn.
2. Navigate to the course catalogue.
3. Find a course.
4. Open a lesson.
5. Access the content through their preferred accessibility method.
6. Complete an independent learning activity.
7. View their updated progress.

This scenario must be tested with target learners and the required accessibility testing tools.

## 8. Mandatory Testing

- NVDA screen-reader testing.
- TalkBack screen-reader testing.
- Keyboard-only navigation.
- 200% zoom testing.
- Caption testing.
- Sign-language window testing.
- Audio description testing.
- Low-bandwidth testing.
- Offline functionality testing.
- Accessible document testing.

Automated checks alone are insufficient.

## 9. Project Scope

### Included
- Accessible learning platform.
- AccessPlayer.
- Offline learning.
- Career Gateway.
- Certificates.
- Savanna integration.
- Accessibility preferences.

### Excluded from initial scope
- Building an entirely new learning management system to replace Savanna.
- Creating an automated sign-language translation system.
- Guaranteeing unsupported third-party integrations.
- Building a complete recruitment platform.

## 10. Project Success Criteria

The project will be considered successful when the core independent learner journey works, accessibility requirements are manually validated, offline functionality is demonstrated, and the supported Savanna integration is tested.

