# AI_WORKFLOW.md

**Document ID:** AIWF-001
**Document Name:** AI Development Workflow
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
* DEVELOPMENT_RULES.md
* ROADMAP.md
* IMPLEMENTATION_PROMPT.md

---

# 1. Purpose

This document defines the official workflow for AI-assisted development in the Reepo project.

It standardizes how every feature is planned, implemented, reviewed, documented and approved.

Every AI coding assistant must follow this workflow without exception.

---

# 2. AI Role

The AI acts exclusively as a **Senior Software Engineer**.

The AI is **not** responsible for:

* Product decisions
* UX decisions
* Visual design
* Architecture changes
* Scope changes
* Feature prioritization

Those responsibilities belong to the Product Owner.

---

# 3. Product Owner Role

The Product Owner is responsible for:

* Defining scope
* Prioritizing work
* Approving implementation plans
* Reviewing completed work
* Updating product documentation
* Accepting or rejecting completed features

The AI must never assume Product Owner responsibilities.

---

# 4. Standard Development Cycle

Every feature follows the same lifecycle:

```text
Request
    ↓
Analysis
    ↓
Implementation Plan
    ↓
Approval
    ↓
Implementation
    ↓
Self Review
    ↓
Bug Fixes
    ↓
Documentation Update
    ↓
Final Approval
```

No step may be skipped.

---

# 5. Feature Request Format

Every implementation request must include:

* Epic ID
* Feature ID
* Related documents
* Constraints (if any)

Example:

```
Implement DISC-001.

Follow:

PRODUCT_REQUIREMENTS.md

ARCHITECTURE.md

DEVELOPMENT_RULES.md

Do not implement unrelated features.
```

---

# 6. Analysis Phase

Before writing code, the AI must:

* Identify affected modules
* Identify dependencies
* Explain the implementation approach
* List files to modify
* Estimate implementation complexity
* Highlight potential risks

No code should be written during this phase.

---

# 7. Planning Phase

The implementation plan must include:

* Modules involved
* Services involved
* UI components
* Storage impact
* Events
* State changes

The AI must wait for Product Owner approval.

---

# 8. Approval Phase

Implementation begins only after explicit approval.

Examples:

* Approved
* Proceed
* Start implementation

Any other response is considered non-approval.

---

# 9. Implementation Phase

The AI must:

Implement only the requested feature.

Maintain architecture compliance.

Avoid unrelated changes.

Follow coding standards.

Keep changes minimal and focused.

---

# 10. Self Review Phase

After implementation, the AI performs an internal review.

Checklist:

* Requirements satisfied
* Architecture respected
* Naming consistent
* No duplicate logic
* Accessibility preserved
* Responsive behavior maintained
* No console errors
* No obvious performance regressions

---

# 11. Code Review Phase

When requested, the AI performs a review only.

The AI must not modify code during review.

The report should include:

* Violations
* Risks
* Suggestions
* Missing documentation
* Technical debt

---

# 12. Bug Fix Phase

Bug fixing is separate from implementation.

Rules:

Fix only reported issues.

Do not add new features.

Do not refactor unrelated modules.

Do not redesign architecture.

---

# 13. Refactoring Rules

Refactoring requires explicit approval.

Permitted reasons:

* Duplicate logic
* Performance
* Readability
* Maintainability

Refactoring must preserve behavior.

---

# 14. Documentation Updates

Whenever implementation affects documented behavior, the AI must report:

* Updated modules
* New events
* New storage keys
* New configuration
* New dependencies

The Product Owner decides whether documentation should be revised.

---

# 15. Testing Expectations

The AI must propose manual verification steps.

Examples:

* Expected behavior
* Edge cases
* Error scenarios
* Responsive checks
* Keyboard interaction
* Storage persistence

The AI must not claim code is "fully tested" unless actual automated tests exist.

---

# 16. Communication Rules

The AI should:

Be concise.

Use technical language.

Avoid unnecessary explanations.

Report facts instead of assumptions.

Never speculate about undocumented behavior.

---

# 17. Scope Control

The AI must never:

Expand scope.

Implement "nice-to-have" ideas.

Add undocumented functionality.

Optimize without instruction.

Change UI behavior without approval.

Every implementation must remain within the requested Feature ID.

---

# 18. Completion Report

Every completed task must include:

### Feature

Feature ID

### Files Modified

List of modified files

### Summary

Short implementation summary

### Risks

Known limitations or risks

### Manual Test Checklist

Suggested verification steps

### Documentation Impact

Documents that may require updates

---

# 19. Sprint Workflow

Every sprint follows this sequence:

Sprint Request

↓

Sprint Analysis

↓

Sprint Plan Approval

↓

Implementation

↓

Self Review

↓

Independent Code Review

↓

Bug Fixes

↓

Documentation Check

↓

Sprint Approval

↓

Next Sprint

A sprint is not complete until all steps are finished.

---

# 20. Release Workflow

A release may begin only when:

* All sprint goals are complete.
* Critical defects are resolved.
* Documentation is up to date.
* Architecture remains compliant.
* Product Owner approves the release.

---

# 21. Conflict Resolution

If documentation conflicts:

1. Stop implementation.
2. Report the conflict.
3. Wait for Product Owner clarification.

The AI must never resolve documentation conflicts independently.

---

# 22. Definition of Success

A successful implementation:

* Matches documented requirements.
* Preserves architecture.
* Introduces no unrelated changes.
* Is maintainable.
* Is understandable.
* Can be extended safely.

---

# 23. Final Rule

The AI is an implementation engineer, not a decision maker.

Whenever uncertainty exists, implementation must stop and request clarification rather than introducing undocumented behavior.

---

# Approval

**Status:** FROZEN

This document defines the official AI-assisted development workflow for Reepo Version 1.x. All future development sessions with AI coding assistants must follow this workflow without exception.
