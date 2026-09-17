# Contributing to ShelfMap

Contributions to ShelfMap are welcome. Please adhere to the guidelines outlined below to ensure consistent code quality and seamless release automation.

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

4. Before committing, run verification checks:
   ```bash
   # Execute core logic tests
   npm run test:core

   # Verify TypeScript types and production compilation
   npm run build
   ```

---

## Commit Message Conventions

This repository enforces the [Conventional Commits specification](https://www.conventionalcommits.org/) to power automated changelog generation and semantic version tagging via Release Please.

Format your commit messages as follows:

```
<type>(<scope>): <subject>
```

### Allowed Types

| Type | Purpose | Release Effect |
| --- | --- | --- |
| `feat` | Introduces a new feature or user-facing functionality | Minor version bump (`0.X.0`) |
| `fix` | Patches a bug or regression | Patch version bump (`0.0.X`) |
| `perf` | Improves execution performance | Patch version bump (`0.0.X`) |
| `docs` | Updates documentation or technical guides | No release bump |
| `refactor`| Code change that neither fixes a bug nor adds a feature | No release bump |
| `test` | Adds or modifies unit / integration tests | No release bump |
| `ci` | Changes to CI/CD workflows or deployment scripts | No release bump |
| `chore` | Dependency updates or routine repository maintenance | No release bump |

### Breaking Changes

Append an exclamation mark after the type/scope or include `BREAKING CHANGE:` in the commit footer:

```
feat(db)!: migrate to relational schema with breaking changes
```

---

## Pull Request Checklist

Before submitting your pull request, verify that:

- [ ] The branch builds cleanly without TypeScript compiler errors (`npm run build`).
- [ ] Core hierarchy and tree traversal tests pass (`npm run test:core`).
- [ ] Commit messages follow the Conventional Commits format.
- [ ] All new functions and services adhere to minimal-dependency, standard-library-first design principles.
