# My FootPrint — Design System & Frontend Aesthetics

**Version:** 2.0
**Date:** March 4, 2026

---

## Design Decisions Summary

| Dimension | Choice |
|---|---|
| Overall mood | Clean, premium Superpower-inspired |
| Typography | Inter (display + body) + IBM Plex Mono (data) |
| Color | White backgrounds, near-black text, burnt orange accent |
| Motion | Smooth ease-out transitions, no spring overshoot |
| Backgrounds | Clean white surfaces with subtle borders and soft shadows |
| Visual accents | Thin category-color stripes, not watercolor blobs |

---

## Claude Frontend Aesthetics Prompt

Copy the block below into your system prompt when generating any frontend code for My FootPrint.

```xml
<frontend_aesthetics>
You are building My FootPrint, a carbon footprint tracking web app. The design is
clean, premium, and confident — inspired by Superpower.com's aesthetic.

MOOD: Minimal and purposeful. White space is a feature, not empty space. Every
element earns its place. The interface should feel like a well-designed tool that
respects the user's attention. Confident but not cold. Premium but not pretentious.

TYPOGRAPHY:
- Headlines + Body: Inter (variable weight). Clean geometric sans-serif that works
  across all sizes. Use weight contrast (400 body, 600 headings, 700 hero) rather
  than font contrast.
- Data / Numbers: IBM Plex Mono. All scores, tons, percentages, and metrics are
  displayed in monospace. Numbers are first-class visual citizens.
- AVOID: Decorative or display fonts. One font family (Inter) handles everything
  except data.

COLOR & THEME:
Use CSS variables for all colors. The palette is neutral with one bold accent.
- --color-base: #FAFAFA (near white) — primary background
- --color-surface: #FFFFFF (white) — card backgrounds, containers
- --color-primary: #1A1A1A (near black) — primary text, icons, headers
- --color-secondary: #6B7280 (cool gray) — secondary elements, borders, tags
- --color-accent: #FC5F2B (BURNT ORANGE) — scores, CTAs, progress, positive change.
  This is the ONLY warm color. Use it sparingly and intentionally. When it appears,
  it commands attention.
- --color-text: #1A1A1A (near black) — body text
- --color-text-muted: #9CA3AF (gray) — secondary text, labels
- --color-negative: #EF4444 (red) — negative change, alerts
- --color-celebrate: #F59E0B (amber) — milestones, celebrations
- --color-accent-glow: rgba(252, 95, 43, 0.08) — subtle glow behind accent elements
Do NOT use warm earth tones, green accents, or watercolor effects.
Text on accent backgrounds MUST be white for contrast.

MOTION & INTERACTIONS:
Smooth and restrained. No spring physics or overshoot.
- Buttons: scale to 0.96 on press with smooth ease-out (cubic-bezier(0.25, 0.46, 0.45, 0.94)).
  Subtle shadow lift on hover.
- Toggles / switches: smooth 200ms transition. No bounce.
- Cards: lift with soft shadow increase on hover/focus. 200ms transitions.
- Number changes (score updates): smooth count-up animation, 800ms duration.
- Page transitions: quick crossfade (300ms). No sliding or bouncing.
- DO NOT add spring animations, overshoot, or bounce effects.
- All transitions respect prefers-reduced-motion.

BACKGROUNDS & SURFACES:
Clean and minimal. No watercolor illustrations or grain textures.
- Cards have white backgrounds with subtle borders (rgba(0,0,0,0.08)).
- Category identity is communicated via a thin 3px color stripe at card top.
- Shadows are neutral: rgba(0, 0, 0, 0.06). Soft and understated.
- No radial gradient blobs or decorative background elements.

LAYOUT:
- Generous whitespace. Let content breathe. Minimum 24px padding.
- Card-based layout with consistent border-radius (16px cards, 12px inner, 8px buttons).
- Mobile-first responsive. On desktop, content max-width 640px centered.
- Dashboard uses vertical scroll with clear section breaks.

AVOID THESE:
- Warm earth tones (sand, terracotta, forest green)
- Watercolor or grain texture backgrounds
- Spring/bounce animations
- Electric green accents
- Overly decorative typography
- Shadow-heavy neumorphism
</frontend_aesthetics>
```

---

## Typography Scale

```
--font-display: 'Inter', sans-serif
--font-mono: 'IBM Plex Mono', monospace
--font-body: 'Inter', sans-serif

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
  --color-base: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-primary: #1A1A1A;
  --color-secondary: #6B7280;
  --color-accent: #FC5F2B;
  --color-text: #1A1A1A;
  --color-text-muted: #9CA3AF;
  --color-negative: #EF4444;
  --color-celebrate: #F59E0B;

  /* Functional tokens */
  --color-accent-glow: rgba(252, 95, 43, 0.08);
  --color-shadow: rgba(0, 0, 0, 0.06);
  --color-border: rgba(0, 0, 0, 0.08);
  --color-overlay: rgba(0, 0, 0, 0.5);

  /* Category accent colors */
  --color-cat-food: #22C55E;
  --color-cat-transit: #3B82F6;
  --color-cat-home: #F59E0B;
  --color-cat-shopping: #A855F7;
  --color-cat-travel: #06B6D4;
  --color-cat-work: #6366F1;
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
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);

/* Hovered / focused card */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);

/* Lifted / dragged element */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.06);

/* Accent glow (for score, CTA buttons) */
--shadow-glow: 0 0 20px rgba(252, 95, 43, 0.12);
```

## Motion Tokens

```css
/* Smooth interaction (buttons, toggles) — no overshoot */
--ease-snap: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--duration-snap: 200ms;

/* Smooth transition (cards, panels) */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--duration-smooth: 300ms;

/* Count-up / number morph */
--duration-count: 800ms;

/* Stagger delay between elements */
--stagger-delay: 80ms;
```

## Category Color Stripes

### Purpose
Category-specific color stripes serve as subtle visual anchors that communicate which domain the user is in. They are thin (3px), positioned at the top of cards.

### Per-Category Colors
| Category | Color | Hex |
|---|---|---|
| Food | Green | #22C55E |
| Transit | Blue | #3B82F6 |
| Home | Amber | #F59E0B |
| Shopping | Purple | #A855F7 |
| Travel | Cyan | #06B6D4 |
| Work | Indigo | #6366F1 |

---

## Component Patterns

### Score Display
```
┌─────────────────────────────┐
│  border-top: 3px accent     │
│                             │
│   YOUR FOOTPRINT            │  ← Inter 500, --text-subhead
│                             │
│   14.2                      │  ← IBM Plex Mono, --text-hero
│   tons CO₂/year             │  ← Inter, --text-caption
│                             │
│   ▼ 0.4 from last month     │  ← Mono, burnt orange
│                             │
└─────────────────────────────┘
  White card with border on base background
  Burnt orange on the delta number ONLY
```

### Category Card
```
┌─────────────────────────────┐
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  │  ← 3px category color stripe
│                             │
│  Food                       │  ← Inter 600, near black
│  4.2 tons · 28%             │  ← Mono, cool gray
│                             │
│  ████████████░░░░░░░░ 28%   │  ← Progress bar, burnt orange fill
│                             │
│  What if you tried          │
│  Meatless Monday? →         │  ← CTA in burnt orange
│                             │
└─────────────────────────────┘
  White card, border border-border, shadow-sm
```

### CTA Button
```
┌─────────────────────────────┐
│      [ Commit to this ]     │  ← burnt orange bg, WHITE text
└─────────────────────────────┘
  rounded-md (8px)
  On press: scale(0.96) + shadow-glow
  On release: smooth ease back to scale(1)
  On hover: shadow-md
```
