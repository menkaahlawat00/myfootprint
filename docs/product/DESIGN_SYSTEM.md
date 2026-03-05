# My FootPrint — Design System & Frontend Aesthetics

**Version:** 1.0
**Date:** March 1, 2026

---

## Design Decisions Summary

| Dimension | Choice |
|---|---|
| Overall mood | Vibrant maximalist — Spotify Wrapped energy |
| Typography | Clash Display headlines + mono data accents |
| Color | Warm earth tones + one electric green pop |
| Motion | Snappy micro-interactions on every tap |
| Backgrounds | Illustrated nature scenes, soft watercolor style |
| Illustration style | Loose, painterly, organic watercolor |

---

## Claude Frontend Aesthetics Prompt

Copy the block below into your system prompt when generating any frontend code for My FootPrint.

```xml
<frontend_aesthetics>
You are building My FootPrint, a carbon footprint tracking web app. Do NOT default to
generic AI aesthetics. Every screen should feel like a poster worth screenshotting.

MOOD: Vibrant maximalist meets warm naturalism. Think Spotify Wrapped's boldness
married to a botanical print studio. High energy, high craft, grounded in nature.
Not neon-tech. Not granola-quiet. The tension between earthy warmth and electric
data visualization IS the brand.

TYPOGRAPHY:
- Headlines: Clash Display (variable weight). Use extreme size jumps — 3x to 5x
  between body and display text. Headlines should dominate the visual hierarchy.
  Bold, geometric, unapologetic.
- Data / Numbers: JetBrains Mono or Fira Code. All scores, tons, percentages,
  and metrics are displayed in monospace. Numbers are first-class visual citizens,
  not afterthoughts. They should feel like they belong on a data dashboard.
- Body text: Space Grotesk or similar clean geometric sans-serif. Readable,
  neutral, does not compete with display type.
- AVOID: Inter, Roboto, Arial, system fonts, or any generic sans-serif.
  Never use the same font for headlines and body. Contrast is everything.

COLOR & THEME:
Use CSS variables for all colors. The palette is warm and earthy with one
electric accent that makes data POP.
- --color-base: #F5F0E8 (warm sand) — primary background
- --color-surface: #E8E0D0 (light sage) — card backgrounds, containers
- --color-primary: #2D5016 (deep forest) — primary text, icons, headers
- --color-secondary: #C4956A (terracotta) — secondary elements, borders, tags
- --color-accent: #00E676 (ELECTRIC GREEN) — scores, CTAs, progress, positive change.
  This is the ONLY bright color. Use it sparingly and intentionally. When it
  appears, it should feel like a signal flare on a calm landscape.
- --color-text: #1A1A18 (near black) — body text
- --color-text-muted: #7A7A6E (stone gray) — secondary text, labels
- --color-negative: #E57373 (soft coral) — negative change, alerts. Use rarely.
- --color-celebrate: #FFD54F (golden yellow) — milestones, celebrations
- --color-accent-glow: rgba(0, 230, 118, 0.15) — subtle glow behind electric green elements
Do NOT use purple gradients, blue-white corporate palettes, or evenly-distributed
rainbow schemes. The palette is WARM with ONE electric exception.

MOTION & INTERACTIONS:
Every tap should feel satisfying. This is a tactile, snappy UI.
- Buttons: scale to 0.96 on press with a spring-back ease (cubic-bezier(0.34, 1.56, 0.64, 1)).
  Subtle shadow lift on hover.
- Toggles / switches: snap with spring physics. Overshoot slightly then settle.
- Cards: lift with soft shadow increase on hover/focus. 150ms transitions.
- Number changes (score updates): morphing count-up animation, not instant replacement.
- Swipeable cards (reveal): smooth slide with momentum and slight bounce at edges.
- Page transitions: quick crossfade (200ms). No slow fades, no sliding pages.
- DO NOT add ambient/continuous animations (floating particles, breathing backgrounds).
  Motion lives in RESPONSE to user action, not in the background.
- All transitions respect prefers-reduced-motion.

BACKGROUNDS & SURFACES:
Each content category has its own soft watercolor nature illustration as a
background element. These are NOT full-bleed wallpapers — they are subtle,
translucent accent illustrations that sit behind content with low opacity (8-15%).
- Food category: loose watercolor leaves, vegetables, organic shapes
- Transit category: flowing road lines, gentle hill silhouettes, bike outlines
- Home category: soft rooftop silhouettes, chimney smoke wisps, window patterns
- Shopping category: fabric textures, flowing bag shapes, textile patterns
- Travel category: cloud formations, horizon lines, airplane contrails
- Banking/Work category: abstract flowing lines, subtle wave patterns
Cards sit ON the warm sand background with soft shadows (no harsh drop-shadows).
Use box-shadow with warm tones: rgba(45, 80, 22, 0.08). The background should
feel like handmade paper — consider a subtle grain texture at 3-5% opacity on
the base layer.

LAYOUT:
- Generous whitespace. Let content breathe. Minimum 24px padding on containers.
- Card-based layout with consistent border-radius (16px for cards, 12px for
  inner elements, 8px for buttons).
- Mobile-first responsive. On desktop, content max-width 480px centered (app-like).
- The reveal experience is FULL-SCREEN swipeable cards, no navigation chrome visible.
- Dashboard uses vertical scroll with clear section breaks.

AVOID THESE AI DEFAULTS:
- Generic gradient hero sections
- Thin 1px borders everywhere
- Gray-on-white low-contrast text
- Perfectly symmetrical layouts
- Stock illustration style (undraw, humaaans)
- Overly rounded "pill" everything
- Shadow-heavy neumorphism
- Blue as a primary color
- Centered paragraph text
- Generic card grids with no hierarchy

Interpret these guidelines creatively. Each screen should feel intentionally
designed, not templated. Prioritize visual hierarchy — one element per screen
should clearly dominate attention.
</frontend_aesthetics>
```

---

## Typography Scale

```
--font-display: 'Clash Display', sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
--font-body: 'Space Grotesk', sans-serif

--text-hero:    72px / 1.0  / weight 700  (reveal cards, celebration screens)
--text-display: 48px / 1.1  / weight 600  (page titles, score headline)
--text-heading: 28px / 1.2  / weight 600  (section headers)
--text-subhead: 20px / 1.3  / weight 500  (card titles, category names)
--text-body:    16px / 1.5  / weight 400  (paragraphs, descriptions)
--text-caption: 13px / 1.4  / weight 400  (labels, metadata, timestamps)
--text-data:    36px / 1.0  / weight 500  (scores, metrics — in mono font)
--text-data-sm: 20px / 1.0  / weight 500  (inline metrics — in mono font)
```

## Color Tokens

```css
:root {
  /* Base palette */
  --color-base: #F5F0E8;
  --color-surface: #E8E0D0;
  --color-primary: #2D5016;
  --color-secondary: #C4956A;
  --color-accent: #00E676;
  --color-text: #1A1A18;
  --color-text-muted: #7A7A6E;
  --color-negative: #E57373;
  --color-celebrate: #FFD54F;

  /* Functional tokens */
  --color-accent-glow: rgba(0, 230, 118, 0.15);
  --color-shadow: rgba(45, 80, 22, 0.08);
  --color-border: rgba(45, 80, 22, 0.1);
  --color-overlay: rgba(26, 26, 24, 0.5);

  /* Category accent colors (used for watercolor tinting) */
  --color-cat-food: #6B8E23;
  --color-cat-transit: #8B7355;
  --color-cat-home: #A0522D;
  --color-cat-shopping: #9370DB;
  --color-cat-travel: #5F9EA0;
  --color-cat-work: #708090;
}
```

## Spacing Scale

```
--space-xs:   4px
--space-sm:   8px
--space-md:   16px
--space-lg:   24px
--space-xl:   32px
--space-2xl:  48px
--space-3xl:  64px
--space-4xl:  96px
```

## Border Radius

```
--radius-sm:   8px   (buttons, small elements)
--radius-md:   12px  (inner cards, inputs)
--radius-lg:   16px  (cards, containers)
--radius-xl:   24px  (modals, hero elements)
--radius-full: 9999px (pills, avatar badges)
```

## Shadow System

```css
/* Resting card */
--shadow-sm: 0 1px 3px var(--color-shadow);

/* Hovered / focused card */
--shadow-md: 0 4px 12px var(--color-shadow);

/* Lifted / dragged element */
--shadow-lg: 0 8px 24px var(--color-shadow);

/* Electric green glow (for score, CTA buttons) */
--shadow-glow: 0 0 20px var(--color-accent-glow);
```

## Motion Tokens

```css
/* Snappy interaction (buttons, toggles) */
--ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-snap: 150ms;

/* Smooth transition (cards, panels) */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--duration-smooth: 200ms;

/* Count-up / number morph */
--duration-count: 800ms;

/* Stagger delay between elements */
--stagger-delay: 80ms;
```

## Watercolor Illustration Guidelines

### Purpose
Category-specific watercolor illustrations serve as ambient visual anchors that immediately communicate which domain the user is in. They are NOT decoration — they are wayfinding.

### Specifications
- **Opacity:** 8-15% over the base background. Never compete with content.
- **Position:** Bottom-right or bottom-left of the viewport/card. Bleed off the edge.
- **Style:** Loose, painterly watercolor. Visible brush strokes. Colors bleed outside lines.
- **Palette:** Tinted with the category accent color, desaturated to blend with the warm sand base.
- **Format:** SVG with embedded raster textures, or optimized PNG with transparency.
- **Size:** Max 400x400px rendered. Lazy-loaded. Not critical path.

### Per-Category Subjects
| Category | Illustration Elements |
|---|---|
| Food | Scattered leaves, tomato cross-sections, herb sprigs, grain stalks |
| Transit | Flowing road ribbon, gentle hills, bicycle wheel, footprints |
| Home | Roofline silhouette, chimney wisps, window with plant, warm light glow |
| Shopping | Draped fabric, open tote, thread spools, textile weave pattern |
| Travel | Layered cloud banks, distant horizon, sun arc, contrail curves |
| Banking/Work | Abstract flowing streams, ripple patterns, branching lines |

---

## Component Patterns

### Score Display
```
┌─────────────────────────────┐
│                             │
│   YOUR FOOTPRINT            │  ← Clash Display, --text-subhead
│                             │
│   14.2                      │  ← JetBrains Mono, --text-hero
│   tons CO₂/year             │  ← Space Grotesk, --text-caption
│                             │
│   ▼ 0.4 from last month     │  ← Mono, electric green, with glow
│                             │
└─────────────────────────────┘
  Surface card on sand background
  Electric green on the delta number ONLY
```

### Category Card
```
┌─────────────────────────────┐
│  🍃 ░░░░░░░░░░░░░░░░░░░░░  │  ← watercolor leaves at 10% opacity
│                             │
│  Food                       │  ← Clash Display, deep forest
│  4.2 tons · 28%             │  ← Mono, terracotta
│                             │
│  ████████████░░░░░░░░ 28%   │  ← Progress bar, electric green fill
│                             │
│  What if you tried          │
│  Meatless Monday? →         │  ← CTA in electric green
│                             │
└─────────────────────────────┘
  Tap lifts card (shadow-md), spring-back ease
```

### CTA Button
```
┌─────────────────────────────┐
│      [ Commit to this ]     │  ← electric green bg, deep forest text
└─────────────────────────────┘
  radius-sm (8px)
  On press: scale(0.96) + shadow-glow
  On release: spring back to scale(1)
  On hover: shadow-md
```
