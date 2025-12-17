# JS Content Calendar

A Next.js (App Router) + Tailwind + shadcn/ui project that recreates the **Weekly Content Calendar** UI and exports an **exact A4 landscape PDF** from the preview using **html2canvas + jsPDF**.

## Features
- Two-column layout:
  - Left: editable form controls (logo + day-by-day fields + mood image upload)
  - Right: A4 landscape preview that matches the provided UI layout
- One-click **Download PDF**
- Client-side, high-quality PDF export (A4 landscape)

## Run locally
```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000/calendar`

## PDF export notes
The preview is rendered at A4 landscape size and exported using `html2canvas` (scale 2) and `jsPDF` (A4 landscape). This keeps text and lines crisp.

## Tests
```bash
npm test
```
A minimal test checks that the PDF export helper can run in a DOM-like environment.
