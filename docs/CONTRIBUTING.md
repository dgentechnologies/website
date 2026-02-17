# Contributing Guide

Thank you for considering contributing to the DGEN Technologies website.

## Branching Strategy

- Create feature branches from `main`:
  - `feature/<short-name>` for new features
  - `fix/<short-name>` for bug fixes
- Keep changes focused and small.

## Commit Messages

- Use clear, imperative messages:
  - `feat(admin): add performance view`
  - `fix(blog): correct slug generation`

## Pull Requests

- Ensure code builds and typechecks:
  - `npm run typecheck`
  - `npm run build`
- Add/update documentation in `docs/` and `README.md`.
- Link related issues, provide screenshots for UI changes.

## Coding Standards

- Follow existing component patterns and Tailwind conventions.
- Avoid unrelated reformatting.
- Keep accessibility in mind (ARIA, focus states).

## Environment & Secrets

- Do not commit secrets. Use `.env.local` and deployment providers’ secret managers.
- Validate `firestore.rules` for least-privilege writes.
