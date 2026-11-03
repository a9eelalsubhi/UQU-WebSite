# PRODUCT — بوابة كلية الطب (UQU MedHub)

> Assumptions inferred from the repository and the user's brief (3 Nov 2026); no full init interview was run.

- **What it is:** an interactive prototype of a unified digital portal for the College of Medicine, Umm Al-Qura University: slide library by year and course, service tickets, initiative tracking, reports, permissions, portal settings.
- **Who uses it:** students, faculty, service staff, and portal admins. Today's audience is the college dean, evaluating whether to adopt the initiative.
- **Platform:** static web app (`dist/`), Arabic RTL, works offline from local files. No backend; demo data lives in localStorage.
- **Brand commitments:** official UQU College of Medicine logo (teal + gold), Thmanyah Serif Display for display type. Visual direction pinned by the user: modern, clean, medical.
- **Constraints:** every existing feature and role flow must keep working; no external runtime dependencies (vendor everything into `dist/assets`); respect `prefers-reduced-motion`; both light and dark themes.
- **Tone:** formal, warm, concise Arabic. No English marketing slogans.
