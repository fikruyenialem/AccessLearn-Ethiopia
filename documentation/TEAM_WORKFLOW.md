# AccessLearn Ethiopia
## Team Collaboration and Development Workflow

**Version:** 1.0  
**Team:** Three developers  
**Repository:** AccessLearn-Ethiopia

---

## 1. Team Philosophy

All three developers contribute to building the complete AccessLearn Ethiopia platform.

Each developer has primary areas of responsibility, but nobody works in isolation.

The team shares responsibility for:
- Understanding the architecture.
- Reviewing code.
- Integrating features.
- Testing.
- Solving technical problems.
- Maintaining documentation.

## 2. Primary Responsibilities

### Developer 1: Frontend and User Experience

Primary ownership:
- React architecture.
- Dashboard.
- Course catalogue.
- Lesson interfaces.
- Frontend API integration.
- Reusable UI components.
- Responsive design.

### Developer 2: Backend and Database

Primary ownership:
- FastAPI architecture.
- PostgreSQL.
- SQLAlchemy models.
- Authentication.
- REST APIs.
- Learning progress.
- Data validation.

### Developer 3: Accessibility and Integration

Primary ownership:
- AccessPlayer accessibility functionality.
- Caption and transcript infrastructure.
- Ethiopian Sign Language media integration.
- Audio descriptions.
- Offline functionality.
- Savanna integration adapter.

### Shared Responsibilities

All three developers:
- Review each other's work.
- Understand frontend and backend communication.
- Participate in integration.
- Write tests.
- Document important decisions.
- Help resolve bugs.
- Test the final learner experience.

## 3. GitHub Workflow

The project will use Git and GitHub for collaboration.

### Main branches

- `main`: Stable production-ready code.
- `develop`: Integrated development branch.

### Feature branches

Examples:

```text
feature/frontend-dashboard
feature/course-management
feature/authentication-api
feature/access-player
feature/offline-learning
feature/savanna-integration
```

### Development process

1. Obtain the latest changes from `develop`.
2. Create a feature branch.
3. Implement the assigned feature.
4. Run relevant tests.
5. Commit the changes.
6. Push the branch to GitHub.
7. Create a pull request.
8. Review and resolve feedback.
9. Merge into `develop`.

The `main` branch should only receive tested, reviewed releases.

## 4. Commit Convention

Use meaningful commit messages.

Examples:

```text
feat: add course catalogue
feat: implement user authentication
fix: correct lesson progress update
test: add access player tests
docs: update API documentation
refactor: organize frontend features
```

Avoid vague commit messages such as:

```text
updated
changes
final
done
```

## 5. Code Review Rules

Before merging:

- Check whether the feature meets its requirements.
- Check whether existing functionality still works.
- Check for accessibility problems.
- Check error handling.
- Check whether tests pass.
- Check whether documentation needs updating.

At least one other developer should review a feature before it is merged.

## 6. API Collaboration

Frontend and backend developers must agree on API contracts before connecting features.

API documentation should include:
- Endpoint.
- HTTP method.
- Authentication requirements.
- Request body.
- Response body.
- Possible error responses.

FastAPI's OpenAPI documentation will be used during development.

## 7. Integration Rules

- Integrate small features frequently.
- Avoid maintaining long-lived feature branches.
- Do not independently change shared API contracts.
- Notify teammates about breaking changes.
- Keep the `develop` branch usable.
- Resolve integration conflicts as early as possible.

## 8. Testing Responsibilities

Each developer tests their own contribution.

The team collectively validates:
- Complete learner journeys.
- Accessibility requirements.
- Offline functionality.
- Backend security.
- Savanna integration.
- Performance and reliability.

## 9. Communication

The team should maintain:
- A shared task board.
- A shared GitHub repository.
- A documented list of decisions.
- Regular progress discussions.
- Clear reporting of blockers.

Each developer should communicate:
1. What they completed.
2. What they are working on.
3. What is blocked.
4. What assistance they need.

## 10. Definition of Done

A feature is considered complete when:

- Its requirements are satisfied.
- Its implementation works.
- Relevant tests pass.
- Accessibility has been considered and tested.
- Code has been reviewed.
- Documentation has been updated where necessary.
- It has been integrated into the development branch.

## 11. Team Principle

We are building one product together.

Primary responsibility determines who leads a particular feature, not who is allowed to understand or contribute to it.

