# Simple React Template

A minimal React + Vite + TypeScript app for Rundot-enabled projects.

## What's Included

- **Tab navigation** — 3 demo tabs (Home, Ads, Settings) with a fixed bottom tab bar
- **Theme system** — Centralized design tokens applied as CSS variables
- **appStorage** — Counter demo with save/load via `RundotGameAPI.appStorage`
- **Ad integration** — Interstitial + rewarded ad buttons
- **Error boundary** — Catches and displays errors gracefully
- **Safe area handling** — Tab bar respects device insets
- **Landscape warning** — CSS-only portrait orientation guard

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/    # Button, Card, Stack, ErrorBoundary, TabBar
├── tabs/          # HomeTab, AdsTab, SettingsTab, tabConfig
├── theme/         # Design tokens (colors, spacing, fonts)
├── App.tsx        # Minimal shell: tabs + content
├── main.tsx       # Entry point
└── style.css      # Global styles
```

## Customizing

1. **Add tabs** — Edit `src/tabs/tabConfig.tsx` to add/remove tabs
2. **Change theme** — Edit `src/theme/default.ts` to update colors, spacing, etc.
3. **Add components** — Create new components in `src/components/`

### Typography

Prefer the semantic text roles in `theme.text` (`display`, `displaySm`, `h1`, `h2`, `h3`, `bodyLg`, `body`, `bodySm`, `label`, `caption`, `numeric`) as the default API for text. Each role is wired to CSS variables (`--text-<role>`, `--text-<role>-lh`, `--text-<role>-weight`) and utility classes (`.text-h1`, `.text-body-sm`, etc.). The active scale is chosen by device class (`mobile` / `desktop` / `tv`) via `applyDeviceClass()` in `main.tsx`. The legacy `theme.fontSize` scale (`xs..xxl`) is still available as an escape hatch — prefer the semantic roles for any new code.

> **Native element restyling.** Native `<h1>`, `<h2>`, `<h3>`, and `<p>` elements pick up the semantic role sizes via element selectors in `style.css` so existing markup just works. If you want one of those elements without the token size — for example a `<p>` that should render at caption size — apply a utility class on a non-semantic element instead (e.g. `<div className="text-caption">`) or override locally with another `text-*` utility.
