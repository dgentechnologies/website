# Security Policy

We take security seriously and appreciate responsible disclosures.

## Supported Versions

We support the latest `main` branch and the most recent release tags. Older versions may not receive security fixes.

## Reporting a Vulnerability

- Email: security@dgentechnologies.com
- Please include:
  - A detailed description of the issue and impact
  - Steps to reproduce and affected components/files
  - Any relevant logs or screenshots
- We aim to acknowledge reports within 72 hours and provide regular status updates.

## Handling Sensitive Data

- Secrets are managed via environment variables (e.g., `.env.local`) and hosting provider secret managers.
- Do not include secrets in commits, logs, or screenshots.
- Firestore rules should enforce least privilege; restrict write access to admin users.

## Best Practices

- Rotate Unsplash and Firebase credentials periodically.
- Use HTTPS everywhere and secure cookies for sessions.
- Keep dependencies updated; run `npm audit` regularly.

## Disclosure

Please do not create public issues for security vulnerabilities. Use the email above. Once resolved, we will publish a security advisory if applicable.
