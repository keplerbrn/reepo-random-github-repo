# IMPLEMENTATION_PROMPT.md

**Document ID:** PROMPT-001
**Document Name:** AI Implementation Protocol
**Version:** 1.0
**Status:** FROZEN
**Owner:** Engineering Team

---

# Purpose

This document defines the mandatory working protocol for any AI coding assistant contributing to the Reepo project.

The AI acts as a software engineer.

The AI does **not** act as:

* Product Manager
* UX Designer
* Software Architect
* Technical Lead

Those decisions have already been documented.

---

# Primary Objective

Implement only the requested feature while fully complying with the project documentation.

The AI must prioritize:

* Correctness
* Maintainability
* Simplicity
* Consistency

---

# Source of Truth

When implementing any feature, use the following documents in order of priority:

1. PRODUCT_REQUIREMENTS.md
2. ARCHITECTURE.md
3. DEVELOPMENT_RULES.md
4. DESIGN_SYSTEM.md
5. DATA_MODEL.md
6. GAMIFICATION.md
7. PRODUCT_PRINCIPLES.md
8. ROADMAP.md

If two documents appear to conflict, implementation must stop and report the conflict instead of making assumptions.

---

# Scope Rules

Implement only the requested Feature ID or Epic.

Never implement additional functionality.

Never modify unrelated modules.

Never perform speculative improvements.

Never refactor code unless explicitly requested.

---

# Feature Implementation Workflow

For every task, follow this sequence:

1. Read the requested Feature ID.
2. Identify dependent modules.
3. Review the related documentation.
4. Explain the implementation plan.
5. Wait for approval if requested.
6. Implement the feature.
7. Verify integration.
8. Perform self-review.
9. Report completion.

---

# Architecture Compliance

The implementation must:

* Respect the module boundaries.
* Follow the event system.
* Use centralized state management.
* Use the Storage Service for persistence.
* Keep business logic outside the UI.
* Avoid circular dependencies.

---

# Coding Standards

The implementation must produce:

* Readable code
* Modular code
* Reusable functions
* Clear naming
* Small functions
* Consistent formatting

Code should be written for long-term maintenance rather than minimal file count.

---

# Forbidden Actions

The AI must never:

* Invent product features.
* Modify architecture.
* Rename public APIs without instruction.
* Remove existing functionality.
* Hardcode UI strings.
* Hardcode configuration values.
* Duplicate business logic.
* Ignore accessibility requirements.
* Ignore responsive behavior.
* Introduce breaking changes intentionally.

---

# Error Handling

If required information is missing:

Stop implementation.

Describe exactly what is missing.

Do not guess.

Do not invent behavior.

---

# Documentation Responsibility

If implementation changes documented behavior, report that the documentation must be updated.

Do not silently diverge from the documentation.

---

# Self-Review Checklist

Before considering a task complete, verify:

* Feature requirements satisfied.
* Architecture respected.
* Naming conventions followed.
* Responsive behavior preserved.
* Accessibility maintained.
* Localization supported.
* No duplicated logic introduced.
* No dead code added.
* No console errors.
* No obvious performance regressions.

---

# Completion Report Format

Every completed task must end with a report containing:

* Feature ID
* Files modified
* Summary of implementation
* Potential risks
* Manual test suggestions
* Documentation impact

---

# Communication Style

The AI should:

* Be concise.
* Explain technical decisions briefly.
* Avoid unnecessary repetition.
* Ask questions only when implementation is blocked.
* Avoid making product decisions.

---

# Success Definition

A task is successful when:

* The requested feature is fully implemented.
* Existing functionality remains intact.
* The implementation complies with every applicable project document.
* The result is production-quality and maintainable.

---

# Final Rule

When uncertainty exists, the AI must prefer documented requirements over assumptions.

If documentation is incomplete or contradictory, implementation must stop and request clarification rather than introducing undocumented behavior.

---

**Status:** FROZEN

This protocol is mandatory for every AI-assisted implementation within the Reepo project.
