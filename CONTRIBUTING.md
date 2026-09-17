# Contributing to ShelfMap

Contributions to ShelfMap are welcome. Please adhere to the guidelines outlined below to ensure consistent code quality and automated release verification.

---

## Table of Contents

- [Development Workflow](#development-workflow)
- [Code Standards & Architecture Rules](#code-standards--architecture-rules)
- [Commit Message Conventions](#commit-message-conventions)
- [Pre-Commit Hooks & Quality Gates](#pre-commit-hooks--quality-gates)
- [Pull Request Checklist](#pull-request-checklist)

---

## Development Workflow

1. Fork the repository and create a descriptive feature branch:
   ```bash
   git checkout -b feat/my-new-feature
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Before staging commits, run the local verification suite:
   ```bash
   # Run core hierarchy and tree traversal tests
   npm run test:core

   # Verify TypeScript types and production bundle compilation
   npm run build
   ```

---

## Code Standards & Architecture Rules

ShelfMap follows a strict minimal-abstraction, standard-library-first engineering model:

1. **Native Platform Features Over Dependencies**:
   Use browser platform APIs (`HTML5 Canvas` for image scaling, `Web Audio API` for audio beeps, `localStorage` for offline state) instead of adding external npm dependencies.
2. **Strict TypeScript Typing**:
   Code must compile with `verbatimModuleSyntax: true` and `noUnusedLocals: true`. Always use `import type { ... }` for interface imports.
3. **Hallmark Workshop Design Discipline**:
   - Zero floating gradient soup or bouncing hover scales (`hover:scale-105`).
   - Constant 1px border widths without focus layout shifts (`outline: 2px solid transparent`).
   - All numerical quantities and breadcrumb steps must use `font-mono tabular-nums`.
4. **Root Cause Bug Fixing**:
   When patching tree traversal or container hierarchy logic, update the shared algorithm in `src/services/db.ts` and add a corresponding test in `src/services/db.test.ts`.

---

## Commit Message Conventions

This repository enforces the [Conventional Commits specification](https://www.conventionalcommits.org/) to power automated changelog generation and semantic version tagging via Release Please.

Format your commit messages as follows:

```text
<type>(<scope>): <subject>
```

### Allowed Types

| Type | Purpose | Release Effect |
| :--- | :--- | :--- |
| `feat` | Introduces a new feature or user-facing functionality | Minor version bump (`0.X.0`) |
| `fix` | Patches a bug or regression | Patch version bump (`0.0.X`) |
| `perf` | Improves execution performance | Patch version bump (`0.0.X`) |
| `docs` | Updates documentation or technical guides | No release bump |
| `refactor` | Code change that neither fixes a bug nor adds a feature | No release bump |
| `test` | Adds or modifies unit / integration tests | No release bump |
| `ci` | Changes to CI/CD workflows or deployment scripts | No release bump |
| `chore` | Dependency updates or routine repository maintenance | No release bump |

### Breaking Changes

Append an exclamation mark after the type/scope or include `BREAKING CHANGE:` in the commit footer:

```text
feat(db)!: migrate to relational schema with breaking changes
```

---

## Pre-Commit Hooks & Quality Gates

This repository uses Husky (`.husky/pre-commit`) to automatically run verification checks before any commit is accepted:
1. `npm run test:core`: Tests recursive tree traversal, cycle detection, search, and QR matching.
2. `npm run build`: Type-checks with `tsc -b` and builds with Vite.

Commits that fail either step will be rejected by git.

---

## Pull Request Checklist

Before submitting your pull request, verify that:

- [ ] The branch builds cleanly without TypeScript compiler errors (`npm run build`).
- [ ] Core hierarchy and tree traversal tests pass (`npm run test:core`).
- [ ] Commit messages follow the Conventional Commits format.
- [ ] No extraneous dependencies were added without explicit architectural rationale.
- [ ] UI modifications preserve the Hallmark workshop aesthetic and monospace `tabular-nums` formatting.

