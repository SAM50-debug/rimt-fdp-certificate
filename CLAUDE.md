# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Faculty Development Programme (FDP) certificate system for RIMT University — "Interactive AI with Raspberry Pi." Users enter their employee code to preview and download a personalized participation certificate as a PDF. Each certificate carries a QR code linking to a public verification page.

- **Stack**: React 19 + TypeScript 6 + Vite 8 frontend; Vercel serverless functions backend
- **Styling**: Tailwind CSS v4 (Vite plugin)
- **Deployment**: Vercel (`vercel.json` rewrites API calls and SPA fallback)

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Type-check (tsc -b) then build for production
npm run lint         # ESLint across the project
npm run preview      # Preview production build locally
```

## Architecture

### Routing (React Router v7)

| Path                        | Page      | Purpose                                |
|-----------------------------|-----------|----------------------------------------|
| `/`                         | `Home`    | Employee code input form               |
| `/preview/:employeeCode`    | `Preview` | Visual certificate preview + PDF download |
| `/verify/:serialNo`         | `Verify`  | Public verification via serial number from QR code |
| `*`                         | `NotFound`| 404 fallback                           |

### Backend API (Vercel serverless, `api/` directory)

Two endpoints, both POST-only:

- **`api/find-employee.ts`** — Accepts `{ employeeCode }` or `{ serialNo }`. Returns a `FacultyRecord` (`{ 'Employee Code', 'Name', 'Serial No' }`) or 404.
- **`api/generate-certificate.ts`** — Accepts `{ employeeCode }`. Generates a PDF using `pdf-lib`: embeds the certificate template image, overlays the name (CanvaSans-Bold font), serial suffix (TTSquares-Bold font, rotated), and a QR code pointing to the verify URL. Returns the PDF as a downloadable blob.

Both share the data layer in `api/lib/faculty.ts`, which reads `data/faculty.xlsx` at runtime using the `xlsx` library. Data is cached in memory after first load.

### PDF coordinate system

`src/constants/certificate.ts` defines all positioning constants (name, QR, serial suffix). The constants are designed against a reference preview size (874×620 px). At PDF generation time, positions are scaled to match the actual template image dimensions using `scaleX` / `scaleY` factors.

Font baseline compensation uses fontkit's `descent` / `unitsPerEm` metrics to align text correctly — the preview page uses CSS `bottom` positioning, while the PDF generator must account for font descenders.

### Data flow

1. `data/faculty.xlsx` — Master data (Employee Code, Name, Serial No). **This is the source of truth.**
2. Serverless functions read and cache it on first request.
3. `vercel.json` ensures `data/` and `assets/` are included in function bundles.

### Key third-party patterns

- **Tailwind v4**: No `tailwind.config` file — config is CSS-first via `@import "tailwindcss"` in `src/index.css`. Arbitrary values use bracket syntax (e.g. `shadow-[0_8px_30px_rgb(0,0,0,0.08)]`).
- **React Compiler (babel-plugin-react-compiler)**: Enabled — no manual `useMemo`/`useCallback` needed.
- **TypeScript 6**: Uses `erasableSyntaxOnly` mode.

## Project-specific constants

The verify base URL is hardcoded in `api/generate-certificate.ts` as:
```
https://fdprimt.vercel.app
```
If the deployment domain changes, this must be updated so QR codes point to the correct verify page.