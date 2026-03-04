---
name: decktape-export
description: Export the live slide deck to PDF with decktape and split the PDF into high-quality per-slide images for sharing.
---

# Decktape PDF + Slide Images

Use decktape to export the live slide deck at https://palewi.re/docs/ire-archive-slide-deck/ to a PDF, then convert each page into a high-quality PNG that can be posted on LinkedIn.

## When to Use

- You need a fresh PDF export of the published deck.
- You need individual PNGs of each slide for social posts (LinkedIn, Twitter, etc.).

## Prerequisites

- Node 18+ (for `npx`)
- decktape (pulled on-demand via `npx decktape`)
- ImageMagick for PDF-to-PNG (`brew install imagemagick` on macOS)

## Script Location

- PDF + PNG pipeline: `.github/skills/decktape-export/scripts/export.cjs`

## Default Outputs

- PDF: `static/screenshots/decktape/ire-archive-deck.pdf`
- PNGs: `static/screenshots/decktape/slides/slide-01.png`, `slide-02.png`, ...

## Quick Run (defaults)

```bash
node .github/skills/decktape-export/scripts/export.cjs
```

Exports the live deck to PDF at 1440x900, then writes PNGs at 220 DPI and quality 95.

## Custom Run Examples

```bash
# Higher resolution PNGs with the live deck URL
node .github/skills/decktape-export/scripts/export.cjs \
  --url https://palewi.re/docs/ire-archive-slide-deck/ \
  --pdf static/screenshots/decktape/ire-archive-deck.pdf \
  --images static/screenshots/decktape/slides \
  --width 1920 --height 1080 \
  --density 300 --quality 100

# Export to a one-off folder for sharing
node .github/skills/decktape-export/scripts/export.cjs \
  --images static/screenshots/decktape/linkedin \
  --pdf static/screenshots/decktape/ire-archive-deck.pdf
```

## What the Script Does

1. Runs `npx decktape --size <width>x<height> <url> <pdf>` to export the Reveal deck as a PDF.
2. Runs ImageMagick (`magick` or `convert`) to split the PDF into numbered PNGs with your density/quality settings.
3. Writes files under `static/` so they can be served directly if needed.

## Tips

- LinkedIn prefers wide images; 1920x1080 with density 220+ looks crisp.
- Re-run whenever slides change; the script overwrites the PDF and PNGs in place.
- If `magick` is not found, install ImageMagick (`brew install imagemagick`) and rerun.
