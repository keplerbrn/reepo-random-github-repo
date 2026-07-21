# ARCHITECTURE.md

**Document ID:** ARC-001
**Document Name:** Software Architecture Document
**Version:** 1.0
**Status:** FROZEN
**Owner:** Software Architecture
**Related Documents:**

* PROJECT_VISION.md
* PRODUCT_PRINCIPLES.md
* PRODUCT_REQUIREMENTS.md

---

# 1. Purpose

This document defines the software architecture of Reepo.

Its purpose is to establish a scalable, maintainable and modular foundation for the application.

All implementation must follow this architecture.

No architectural decisions may be changed during implementation without updating this document.

---

# 2. Architecture Goals

The architecture must prioritize:

* Simplicity
* Maintainability
* Scalability
* Modularity
* Performance
* Testability
* Separation of Concerns

---

# 3. Architectural Style

Reepo follows a layered modular architecture.

```
Presentation Layer

↓

Application Layer

↓

Service Layer

↓

Core Layer

↓

Storage Layer
```

Each layer has a single responsibility.

Layers communicate only with adjacent layers.

---

# 4. Technology Stack

Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES Modules)

Storage

* LocalStorage

Data

* JSON Repository Dataset
* GitHub API (future expansion)

Deployment

* GitHub Pages

No framework is used in Version 1.x.

---

# 5. Project Structure

```
reepo/

│
├── index.html
├── style.css
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── sounds/
│   └── fonts/
│
├── data/
│   └── repos.json
│
├── docs/
│
├── js/
│
│   ├── app.js
│
│   ├── core/
│   │
│   ├── services/
│   │
│   ├── ui/
│   │
│   ├── utils/
│   │
│   └── features/
│
└── .github/
```

---

# 6. Core Layer

Responsible for application fundamentals.

Modules include:

* Configuration
* Global State
* Event Bus
* Storage
* Localization
* Constants

Core modules never manipulate the UI.

---

# 7. Service Layer

Responsible for business logic.

Examples:

Repository Service

Randomization Service

Statistics Service

Collection Service

Profile Service

Gamification Service

Services do not modify the DOM.

---

# 8. UI Layer

Responsible for presentation only.

Includes:

Repository Card

Buttons

Modals

Notifications

Sidebar

Profile View

Leaderboard View

Settings View

The UI layer never contains business logic.

---

# 9. Utility Layer

Contains reusable helper functionality.

Examples:

Formatting

Validation

Date Utilities

Animation Helpers

Random Helpers

Utilities must remain stateless.

---

# 10. Feature Layer

Every major feature is isolated.

Examples:

Discovery

Collections

Filters

Profile

Gamification

Statistics

Leaderboards

Settings

Localization

Accessibility

Each feature communicates through shared services and events.

---

# 11. State Management

The application maintains a single global state.

```
Application State

├── User
├── Repository
├── Collections
├── Filters
├── Statistics
├── Badges
├── Settings
├── Localization
└── Session
```

State is the single source of truth.

Direct state mutation outside the state manager is prohibited.

---

# 12. Event System

Modules communicate through events.

Examples:

APP_INITIALIZED

USER_CHANGED

REPOSITORY_LOADING

REPOSITORY_LOADED

REPOSITORY_SAVED

REPOSITORY_REMOVED

FILTER_UPDATED

PROFILE_UPDATED

BADGE_UNLOCKED

LEVEL_UP

SETTINGS_CHANGED

LANGUAGE_CHANGED

DATA_IMPORTED

DATA_EXPORTED

No module should directly invoke another feature's internal logic.

---

# 13. Data Flow

```
User Action

↓

UI

↓

Application Event

↓

Service

↓

State Update

↓

Storage (if required)

↓

UI Refresh
```

The flow must always remain unidirectional.

---

# 14. Storage Architecture

Persistent data:

* User Profile
* Saved Repositories
* Collections
* Statistics
* Settings
* Progress

Session data:

* Current Repository
* Discovery History
* Active Filters

Storage access must occur only through the Storage Service.

Direct LocalStorage access is forbidden.

---

# 15. Repository Data Source

Priority order:

1. GitHub API (future)
2. Local JSON dataset
3. Backup repository dataset

Repository loading must support graceful fallback.

---

# 16. Error Handling

Every service returns structured results.

```
Success

or

Failure
```

Errors are propagated upward.

The UI is responsible for presentation.

Services are responsible for error generation.

---

# 17. Dependency Rules

Allowed:

UI → Service

Service → Core

Core → Storage

Forbidden:

UI → Storage

UI → LocalStorage

UI → API

Feature → Feature

Utility → UI

Core → UI

Circular dependencies are prohibited.

---

# 18. Naming Conventions

Files

camelCase

Classes

PascalCase

Functions

camelCase

Constants

UPPER_SNAKE_CASE

Events

UPPER_SNAKE_CASE

Feature IDs

DISC-001

CARD-001

COL-001

etc.

---

# 19. Performance Principles

Lazy initialization where applicable.

Avoid unnecessary DOM updates.

Reuse UI components.

Cache expensive computations.

Prevent duplicate repository rendering.

Avoid repeated storage reads.

---

# 20. Scalability

The architecture must support future additions without restructuring.

Future capabilities include:

Cloud Sync

Authentication

Recommendation Engine

Plugin System

PWA

Offline Cache

Backend API

No Version 1.x architectural decision should block these expansions.

---

# 21. Non-Goals

The architecture intentionally excludes:

Server-side rendering

Backend services

Database management

Authentication server

Microservices

Framework-specific patterns

---

# 22. Architecture Rules

Every module must have one responsibility.

Business logic must never exist inside UI components.

Storage access must always be abstracted.

Features must remain independent.

Communication must occur through events.

Application state must remain centralized.

Architecture changes require a new document version.

---

# Approval

**Status:** FROZEN

This document defines the official software architecture for Reepo Version 1.x. All implementation must comply with the principles and constraints defined herein.
