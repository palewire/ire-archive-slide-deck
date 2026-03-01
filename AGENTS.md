# AGENTS.md

Instructions for AI agents working on this project.

## Project Overview

This is a **Reveal.js slide deck** for presenting the IRE Resource Center archive site. It's built with SvelteKit 2, Svelte 5, Tailwind CSS v4, mdsvex, D3, and Lucide icons. The deck is styled to match the [palewi.re](https://palewi.re) blog aesthetic.

## Tech Stack

- **Framework**: SvelteKit 2 with Svelte 5 (runes: `$props()`, `$derived()`, `{@render children()}`)
- **Styling**: Tailwind CSS v4 (via Vite plugin), `@tailwindcss/typography` for prose
- **Slides**: Reveal.js 5 with `white.css` theme, SSR disabled (`+page.ts`)
- **Content**: mdsvex `.svx` files — Markdown inside `<Slide>` component wrappers
- **Charts**: D3 (treemap visualization)
- **Icons**: Lucide Svelte
- **Fonts**: Libre Franklin (body/headings), JetBrains Mono (code) via @fontsource
- **Screenshots**: Playwright-based capture scripts in `.github/skills/browser-screenshots/`
- **Build**: `@sveltejs/adapter-static` → outputs to `build/`
- **Deploy**: GitHub Actions → S3 at `palewi.re/docs/ire-archive-slide-deck/`
- **Linting**: Prettier + ESLint with `husky` + `lint-staged` pre-commit hooks

## Project Structure

```
src/
  app.css                    # Global styles (Tailwind + Reveal.js overrides)
  lib/
    index.ts                 # Barrel exports for all components
    presentation.svx         # Slide content (Markdown + Svelte components)
    components/
      Deck.svelte            # Reveal.js bootstrap + initialization
      Slide.svelte           # <section> wrapper with prose classes
      Code.svelte            # Code block with Reveal.js highlight attributes
      Notes.svelte           # Speaker notes wrapper
      Screenshot.svelte      # Browser chrome frame (children-based API)
      ResourceChart.svelte   # D3 treemap visualization
      SearchPipeline.svelte  # SVG pipeline diagram with animated dots
      FeatureCard.svelte     # Icon + title + description card
      PersonCard.svelte      # Photo + name + email card
  routes/
    +layout.svelte           # Root layout (imports app.css, favicon)
    +page.svelte             # Mounts <Deck />
    +page.ts                 # SSR disabled
static/
  screenshots/               # Playwright-captured screenshots
  favicon.ico                # palewi.re favicon
  *.jpg                      # Team headshot photos
```

## Key Patterns

### mdsvex Slide Authoring

Slides are authored in `src/lib/presentation.svx`. Content inside `<Slide>` wrappers is processed as Markdown by mdsvex. **Blank lines around Markdown content inside component tags are mandatory.**

```svx
<Slide>

# Heading

Paragraph with **bold** and [links](https://example.com).

<SomeComponent />

</Slide>
```

### Image Paths

All image `src` attributes must use `{base}` from `$app/paths` to work with the base path (`/docs/ire-archive-slide-deck`). Components that accept image paths should import `base` and prepend it.

### Reveal.js CSS Overrides

Reveal.js theme CSS loads after `app.css`, so overrides need higher specificity. Use `.reveal .slides` prefix:

```css
.reveal .slides img {
	max-width: 100%;
	margin: 0;
}
.reveal .slides section h1 {
	margin-top: 0;
}
```

### Screenshot Component

Uses a children-based API (not `src` prop):

```svx
<Screenshot url="example.com">
  <img src="{base}/screenshots/example.png" alt="Description" />
</Screenshot>
```

### Capturing Screenshots

Uses Playwright scripts in `.github/skills/browser-screenshots/scripts/`:

```bash
# Basic capture
node .github/skills/browser-screenshots/scripts/capture.cjs \
  --url https://example.com --output static/screenshots/example.png

# With authentication
node .github/skills/browser-screenshots/scripts/save-session.cjs \
  --url https://archive.ire.org --session ire
node .github/skills/browser-screenshots/scripts/capture.cjs \
  --url https://archive.ire.org --session ire --output static/screenshots/example.png

# With JS execution before capture
node .github/skills/browser-screenshots/scripts/capture.cjs \
  --url URL --execute "document.querySelector('button').click()" --wait 2000 --output out.png
```

Sessions are stored in `~/.playwright-sessions/` and expire based on site cookie policies.

### SVG Animations in SearchPipeline

The pipeline diagram uses declarative SVG `<animateMotion>` with synced 6-second cycles. Key techniques:

- All dots share the same `dur="6s"` cycle
- `keyPoints`/`keyTimes` control when each dot moves vs. holds position
- `opacity` + `visibility` animations hide dots when inactive
- `visibility` uses `calcMode="discrete"` for instant show/hide (no interpolation)
- Dots start with `opacity="0" visibility="hidden"` to prevent flash on first render

### Prose and Typography

The `<Slide>` component applies `prose max-w-none` from `@tailwindcss/typography`. Use `not-prose` class on elements that should opt out (charts, diagrams, custom layouts).

## Design Tokens

| Token          | Value          | Usage                        |
| -------------- | -------------- | ---------------------------- |
| Font           | Libre Franklin | All text                     |
| Code font      | JetBrains Mono | Code blocks                  |
| Body weight    | 300 (light)    | Body text                    |
| Heading weight | 800            | Headlines                    |
| Text color     | `#000`         | Primary text                 |
| Link color     | `#686868`      | Gray, no accent              |
| Border accent  | `#e5e5e5`      | Top border, card backgrounds |
| IRE blue       | `#2d6a8e`      | Accent (used sparingly)      |
| Background     | `#fff`         | White (Reveal white theme)   |

## Commands

```bash
npm run dev          # Start dev server (localhost:5173/docs/ire-archive-slide-deck/)
npm run build        # Production build to build/
npm run check        # TypeScript/Svelte type checking
npm run lint         # Prettier + ESLint check
npm run format       # Auto-format all files
```

## Gotchas

- **Reveal.js CSS specificity**: Theme CSS (white.css) loads in the component, after app.css. Use `.reveal .slides` selectors to override.
- **`prose` class**: Adds margins to headings, paragraphs, figures, images. Use `not-prose` to opt out.
- **Reveal.js image defaults**: Sets `max-width: 95%; max-height: 95%; margin: var(--r-block-margin) 0` on all images. Override in app.css.
- **Reveal.js centering**: `center: true` by default. Content is vertically centered.
- **Image loading**: `deck.layout()` is called after images load to fix centering on first render.
- **`.svx` files**: Excluded from Prettier (parser can't handle nested Svelte components). Added to `.prettierignore`.
- **`.github/skills/`**: Excluded from ESLint (CJS scripts use `require()`).
- **Base path**: Set to `/docs/ire-archive-slide-deck`. All static asset paths must use `{base}` prefix.
- **Session expiry**: Playwright sessions for authenticated screenshots expire. Re-run `save-session.cjs` when captures fail with login redirects.
