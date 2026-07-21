# DEVELOPMENT_RULES.md

**Document ID:** DEV-001
**Document Name:** Development Standards & Engineering Rules
**Version:** 1.0
**Status:** FROZEN
**Owner:** Engineering Team
**Related Documents:**

* PROJECT_VISION.md
* PRODUCT_PRINCIPLES.md
* PRODUCT_REQUIREMENTS.md
* ARCHITECTURE.md
* DATA_MODEL.md
* DESIGN_SYSTEM.md

---

# 1. Purpose

This document defines the engineering standards used during the development of Reepo.

Every contributor, developer and AI coding assistant must follow these rules.

These standards are mandatory.

---

# 2. General Development Philosophy

Development must prioritize:

* Readability
* Maintainability
* Predictability
* Modularity
* Performance
* Simplicity

Working code is not considered complete unless it also follows these standards.

---

# 3. Single Responsibility Principle

Every module must have one responsibility.

Every function must perform one task.

Every component must represent one UI element.

Mixed responsibilities are prohibited.

---

# 4. Separation of Concerns

The following layers must remain independent.

Presentation

Application Logic

Business Logic

Data Access

Persistence

A layer must never assume the responsibilities of another layer.

---

# 5. File Organization

Files should remain focused.

A file should represent a single feature or responsibility.

Unrelated functionality must never share the same file.

---

# 6. Naming Conventions

Files

camelCase

Folders

lowercase

Functions

camelCase

Classes

PascalCase

Constants

UPPER_SNAKE_CASE

Events

UPPER_SNAKE_CASE

Feature IDs

DISC-001

CARD-001

COL-001

etc.

Naming must always prioritize clarity over brevity.

---

# 7. Function Standards

Functions should:

Have descriptive names.

Receive only necessary parameters.

Return predictable results.

Avoid side effects whenever possible.

A function should never perform multiple unrelated tasks.

---

# 8. Module Standards

Every module must:

Expose a clear public API.

Hide internal implementation details.

Avoid direct dependencies on UI components.

Communicate through services or events.

---

# 9. State Management Rules

Application state is centralized.

State updates must occur only through the state management layer.

Direct mutation is prohibited.

Every state change must be intentional and traceable.

---

# 10. Storage Rules

LocalStorage must never be accessed directly outside the Storage Service.

Persistence logic belongs exclusively to the Storage layer.

---

# 11. Event Rules

Inter-module communication must use events.

Modules must not call each other's internal methods directly.

Events should describe completed actions rather than intentions.

Examples:

REPOSITORY_SAVED

FILTER_UPDATED

PROFILE_CHANGED

BADGE_UNLOCKED

---

# 12. UI Rules

UI components:

Display data.

Collect user input.

Emit events.

They do not contain business rules.

---

# 13. Business Logic Rules

Business logic belongs only to Services.

Examples:

Repository selection

Statistics updates

Badge evaluation

Quest progression

Collection management

These rules must never appear inside UI components.

---

# 14. Error Handling

Errors must be:

Expected

Handled

Recoverable where possible

Every service should return structured results.

Unhandled exceptions are unacceptable.

---

# 15. Logging

Development logs should be meaningful.

Sensitive information must never be logged.

Debug logging should be removable without changing application behavior.

---

# 16. Performance Standards

Avoid unnecessary DOM updates.

Avoid duplicate rendering.

Reuse existing objects when appropriate.

Minimize expensive operations.

Optimize repeated calculations.

Performance regressions are considered defects.

---

# 17. Accessibility Standards

Accessibility is part of development.

Every feature must support:

Keyboard navigation

Visible focus

Semantic HTML

Reduced motion

Proper labels

Accessibility must never be postponed.

---

# 18. Responsive Standards

Every new feature must function on:

Desktop

Tablet

Mobile

Landscape

Portrait

Responsive behavior is required before completion.

---

# 19. Security Standards

Validate imported data.

Escape user-generated content.

Avoid unsafe HTML rendering.

Never trust external data.

Sensitive information must never be stored.

---

# 20. Localization Standards

All user-facing text must originate from the localization system.

Hardcoded UI strings are prohibited.

---

# 21. Component Reuse

Before creating a new component:

Search existing components.

Reuse whenever possible.

Avoid duplicate UI implementations.

---

# 22. Code Review Checklist

Every implementation should confirm:

Architecture respected.

No duplicated logic.

Naming is clear.

No dead code.

No hardcoded values.

Localization supported.

Accessibility considered.

Performance acceptable.

Documentation updated if required.

---

# 23. Documentation Rules

Engineering changes affecting architecture or behavior must update the corresponding documentation.

Documentation is part of the deliverable.

---

# 24. AI Development Rules

AI coding assistants must:

Follow existing architecture.

Never invent new product behavior.

Never change architecture independently.

Never rename established modules without approval.

Never bypass documented requirements.

Implement only the requested feature.

---

# 25. Definition of Done

A feature is complete only if:

Implementation is finished.

Architecture rules are respected.

Responsive behavior is verified.

Accessibility requirements are satisfied.

Localization is supported.

Performance remains acceptable.

No known critical defects exist.

Documentation is updated when necessary.

---

# 26. Prohibited Practices

The following are prohibited:

Direct LocalStorage access outside Storage Service.

Business logic inside UI.

Circular dependencies.

Copy-paste implementations.

Magic numbers.

Unused code.

Unused assets.

Hidden side effects.

Global mutable variables outside the state manager.

Undocumented architectural changes.

---

# 27. Engineering Principles

Prefer composition over duplication.

Prefer readability over cleverness.

Prefer explicit behavior over implicit behavior.

Prefer maintainability over premature optimization.

Prefer consistency over personal preference.

---

# 28. Approval

**Status:** FROZEN

This document defines the mandatory engineering standards for Reepo Version 1.x. Every implementation, regardless of author or tooling, must comply with these rules before being considered complete.
