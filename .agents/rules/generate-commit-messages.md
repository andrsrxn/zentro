---
trigger: always_on
---

Analyze only the staged code changes and generate a commit message following these guidelines:

1. Follow the Conventional Commits format (feat, fix, refactor, docs, chore).
2. The subject line must be in the imperative mood, end with no period, and be strictly under 50 characters.
3. If necessary, add a blank line, then a detailed body where lines are limited to 72 characters.
4. Explain the "what" and "why" concisely.
5. If referring to issues, format like "Fixes #123".
