# DATA_MODEL.md

**Document ID:** DATA-001
**Document Name:** Data Model Specification
**Version:** 1.0
**Status:** FROZEN
**Owner:** Software Architecture Team
**Related Documents:**

* PROJECT_VISION.md
* PRODUCT_PRINCIPLES.md
* PRODUCT_REQUIREMENTS.md
* ARCHITECTURE.md
* GAMIFICATION.md

---

# 1. Purpose

This document defines the logical data model used throughout Reepo.

It specifies the entities, relationships, ownership rules and lifecycle of application data.

This is a conceptual model, not a database schema.

---

# 2. Design Principles

The data model must be:

* Simple
* Predictable
* Modular
* Extensible
* Storage-independent

Business logic must never depend on LocalStorage implementation details.

---

# 3. Root Application State

The application maintains one centralized state.

```
Application

├── User
├── Repository
├── Discovery
├── Collections
├── Filters
├── Statistics
├── Gamification
├── Settings
├── Localization
└── Session
```

Every entity belongs to one root domain.

---

# 4. Entity: User

Represents the current application user.

Attributes include:

* User ID
* Username
* Avatar
* Created Date
* Last Active Date
* Profile Version

Relationships:

Owns

* Collections
* Statistics
* Progress
* Settings

---

# 5. Entity: Repository

Represents a GitHub repository.

Attributes include:

* Repository ID
* Name
* Owner
* Description
* URL
* Language
* Topics
* Stars
* Forks
* License
* Last Updated
* Archived Status
* Fork Status

Repository data is read-only.

Reepo never modifies repository information.

---

# 6. Entity: Discovery Session

Represents exploration history during the current session.

Tracks:

* Current Repository
* Recently Viewed Repositories
* Discovery Count
* Session Start
* Session Duration

Session data is temporary.

---

# 7. Entity: Collection

A user-defined repository group.

Attributes:

* Collection ID
* Name
* Description
* Created Date
* Updated Date

Relationships:

Contains many repositories.

Belongs to one user.

---

# 8. Entity: Saved Repository

Represents a saved relationship between a user and a repository.

Attributes:

* Repository Reference
* Saved Date
* Collection Assignment
* Personal Notes (future)
* Favorite Status

A repository may exist in multiple collections.

---

# 9. Entity: Repository Reaction

Represents user interaction.

Supported reactions:

* Like
* Dislike

A repository may have only one active reaction per user.

---

# 10. Entity: Statistics

Stores cumulative exploration data.

Includes:

* Viewed Count
* Saved Count
* Like Count
* Dislike Count
* Collection Count
* Discovery Time
* Favorite Language
* Average Repository Stars

Statistics are derived data.

---

# 11. Entity: Gamification Profile

Represents progression.

Contains:

* XP
* Level
* Badge References
* Achievement References
* Streak
* Longest Streak
* Completed Quests

Progression data belongs exclusively to one user.

---

# 12. Entity: Badge

Represents an unlocked achievement.

Attributes:

* Badge ID
* Category
* Unlock Date

Badge definitions remain static.

User ownership is dynamic.

---

# 13. Entity: Achievement

Represents completed milestones.

Contains:

* Achievement ID
* Completion Date
* Reward Reference

Achievements are immutable after completion.

---

# 14. Entity: Quest

Represents active progression objectives.

Attributes:

* Quest ID
* Type
* Progress
* Completion Status
* Expiration

Expired quests remain in history.

---

# 15. Entity: Settings

Stores application preferences.

Includes:

* Theme
* Language
* Animation Preference
* Sound Preference
* Compact Mode

Settings belong to one user profile.

---

# 16. Entity: Localization

Stores current language configuration.

Contains:

* Active Language
* Translation Version

Localization data never contains UI logic.

---

# 17. Entity: Leaderboard Entry

Represents ranking information.

Attributes:

* User Reference
* Ranking Category
* Score
* Position

Leaderboard data is read-only for the UI.

---

# 18. Relationships

```
User

├── Collections

├── Statistics

├── Gamification

├── Settings

└── Saved Repositories

Saved Repository

↓

Repository

Collection

↓

Saved Repository

Gamification

↓

Badges

↓

Achievements

↓

Quests
```

Relationships should remain one-directional whenever possible.

---

# 19. Data Ownership

Every entity has a single owner.

| Entity       | Owner                |
| ------------ | -------------------- |
| User         | User Module          |
| Repository   | Repository Service   |
| Collection   | Collection Service   |
| Statistics   | Statistics Service   |
| Settings     | Settings Service     |
| Gamification | Gamification Service |
| Session      | Discovery Service    |

Ownership prevents conflicting updates.

---

# 20. Data Lifecycle

Repository

Loaded

↓

Displayed

↓

Viewed

↓

Optionally Saved

↓

Statistics Updated

↓

Stored

↓

Restored

↓

Archived

Every entity must define its lifecycle.

---

# 21. Persistence Rules

Persistent:

* User
* Collections
* Statistics
* Settings
* Gamification
* Saved Repositories

Temporary:

* Active Repository
* Current Session
* Loading State
* Temporary Notifications

Persistent and temporary data must never be mixed.

---

# 22. Validation Rules

All imported data must be validated.

Invalid entities are rejected.

Corrupted data must never overwrite valid user data.

Validation occurs before persistence.

---

# 23. Versioning

Persistent data must include a version identifier.

Future migrations must preserve compatibility.

Breaking changes require migration procedures.

---

# 24. Future Expansion

The data model must support:

* Cloud Synchronization
* GitHub Authentication
* Multiple Profiles
* Public Profiles
* Team Collections
* Shared Collections
* AI Recommendations
* Plugin Metadata

Future entities must integrate without restructuring the existing model.

---

# 25. Data Model Principles

The model must remain:

Consistent

Predictable

Normalized at the logical level

Easy to migrate

Independent from storage implementation

Scalable

---

# Approval

**Status:** FROZEN

This document defines the official logical data model for Reepo Version 1.x. All application state, persistence and future data extensions must conform to the structure and rules defined in this specification.
