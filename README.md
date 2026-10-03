# VoiceNotes
A voice-first, screen-reader-friendly notes app with an ocean/beach look. Speak or type
notes, format and colour the text, add images, ask questions in plain English, hear the
answer in a better voice, and turn any text into a PDF. Built with Next.js (App Router),
strict TypeScript, Zod, PostgreSQL and Auth.js.

## Pages
- `/` — public home page: what the app does, one "Get started" button
- `/signup`, `/login` — create an account or log in (passwords hashed with bcrypt)
- `/notes` — three-column dashboard: write/ask in the middle, your previous notes + tools on the right
- `/tools`, `/tools/text-to-pdf` — a small tools hub; Text to PDF runs entirely in your browser
- `/profile` — your name and photo
- `/settings` — colour theme (light / beige / dark), text size, read-aloud voice, auto-read, change password

## One-time setup
1. **Database**: create a free project at [neon.tech](https://neon.tech), open its SQL editor, and run everything in `schema.sql`. If you've run an older version of this file before, it's safe to run again — it only adds what's missing (this version adds a `title` column to notes).
2. **Session secret**: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` → `.env.local` as `AUTH_SECRET`.
3. **AI**: a free key from [aistudio.google.com](https://aistudio.google.com) → `.env.local` as `GEMINI_API_KEY`.
4. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`.

## Run it
```
npm install
npm run dev
```
Open http://localhost:3000. Voice input and the rich text toolbar need Chrome or Edge.

## What changed in this pass
- **Notes have names now.** Search matches the note's name, not its (hidden) body. Rename
  any note from inside it.
- **Rich text got richer**: text colour (preset swatches + a custom colour picker) and
  inserting images (resized client-side, then stored as the note's content).
- **Fixed a real bug**: the question box in "Ask your notes" wasn't clearing after an
  answer came back. It now clears once the answer (or an error) arrives.
- **Fixed the auto-read "loop"**: the effect that reads AI answers aloud now returns a
  cleanup function that cancels in-flight speech, which is the correct, React-recommended
  way to avoid double-speaking when an effect re-runs. Auto-read is also on by default now.
- **Voice picker**: Settings lists every voice your browser offers (with a Preview
  button) and remembers your choice. The app also tries to automatically avoid the most
  robotic-sounding system voices if you haven't picked one.

## Design notes, honestly
- **Rich text editor** uses `contentEditable` + `document.execCommand`. It's an old,
  technically deprecated API, but every major browser still supports the commands used
  here. A production app would likely use a library like Tiptap or Lexical instead.
- **Image/HTML sanitizing**: `lib/sanitize.ts` is a small hand-written allowlist — it
  keeps bold/italic/underline/lists, a validated inline colour, and `<img>` tags whose
  `src` is a genuine base64 image (nothing else is kept, no remote URLs, no event
  handlers). This is reasonable because notes are private to their own owner; a
  multi-user or shared-content product should use a real library like
  `isomorphic-dompurify` instead.
- **Voice quality** is ultimately limited by what your OS/browser installs — the Web
  Speech API can only pick among voices that already exist on your machine. The picker in
  Settings is the most reliable way to get a smoother-sounding one if your system has one.

## How accounts work
- Passwords are hashed with bcrypt, sessions are signed JWTs in an HTTP-only cookie.
- Every note and profile is scoped to your user ID in Postgres.

## Roadmap
- [x] Notes: named, rich text (colour, images), voice input, ask/summarize by voice, edit, delete, search by name
- [x] Auth (sign up / log in / log out / change password) + PostgreSQL
- [x] Public home page with one clear call to action and a bit of motion
- [x] Ocean/beach palette with light, beige and dark themes, adjustable text size and voice
- [x] Notes hidden behind an icon, three-column dashboard (compose · previous notes · tools)
- [x] Text to PDF tool, export all notes as .txt
- [ ] PWA icons + install
- [ ] Tests + GitHub Actions
- [ ] AI Paraphraser (placeholder tile only, for now)
