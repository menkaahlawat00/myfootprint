# My FootPrint — Product Requirements Document

**Version:** 1.0
**Date:** March 1, 2026
**Status:** Draft

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [User Journeys](#user-journeys)
3. [Features & Requirements](#features--requirements)
4. [UX/Design Direction](#uxdesign-direction)
5. [Technical Considerations](#technical-considerations)

---

## Product Overview

### What It Is

My FootPrint is a web application that helps people understand, track, and reduce their personal carbon footprint. It turns sustainability into something tangible, personal, and achievable — not abstract or guilt-inducing.

Users answer a handful of quick questions and receive a Spotify Wrapped-style reveal of their carbon impact across every area of their life: housing, transit, food, shopping, banking, travel, and work. They then get personalized, actionable alternatives and track their progress over time through weekly check-ins and challenges.

### Problem Statement

Most people know climate change matters but have no idea what *their* personal contribution looks like or what they can realistically do about it. Existing tools are either:

- **Too complex:** Long surveys, academic jargon, no actionable output
- **Too shallow:** Generic tips ("recycle more!") that don't connect to personal impact
- **Too guilt-driven:** Frame sustainability as sacrifice rather than empowerment
- **Not sticky:** Calculate a number once, then nothing — no ongoing engagement or behavior change

There is no mainstream tool that makes carbon tracking **personal, beautiful, ongoing, and fun** the way fitness trackers made exercise data engaging.

### Target Users

**Primary: Climate-curious newcomers**

- Care about sustainability but haven't tracked their footprint before
- Age 20-40, digitally native, active on social media
- Motivated by curiosity and social identity, not deep environmentalism
- Low tolerance for friction — will abandon if onboarding takes more than 2 minutes
- Need education alongside data — terms like "tons of CO2" mean nothing to them yet
- Respond to positive framing ("you could save X") over negative framing ("you're wasting X")

**Key behavioral insight:** These users don't need convincing that climate matters. They need a tool that makes their personal role *legible* and their actions *feel meaningful*.

### Value Proposition

**For the user:** "Understand your impact in 90 seconds. Reduce it one swap at a time."

- Instant, tangible understanding of your personal footprint
- Personalized alternatives that show exactly what difference each change makes
- A score that improves over time — visible progress toward a goal
- Social validation through shared challenges without exposing personal data
- Bite-sized knowledge that makes you the most informed person in the room

**For the business:** Fully free app monetized through vetted sustainability partnerships. Partners pay for authentic, contextual recommendations (not ads) to users who are actively seeking greener alternatives.

---

## User Journeys

### First-Time User Experience

**Goal:** Land → first FootPrint reveal in under 3 minutes. No sign-up wall before value delivery.

#### Step 1 — Landing (10 seconds)

User arrives at the homepage. They see a clean, beautiful hero with a single message: *"Discover your footprint in 90 seconds."* One call-to-action button. No sign-up required to start.

**What they feel:** Low commitment, curiosity.

#### Step 2 — Quick Estimate (60-90 seconds)

A swipeable, visual questionnaire — not a form. Six cards, one question each:

| # | Question | Input Type | Data Purpose |
|---|---|---|---|
| 1 | Where do you live? | Zip code (auto-suggest) | Energy grid mix, climate zone, regional averages |
| 2 | How do you get around? | Icon selector: car / transit / bike / walk / mix | Transit emissions |
| 3 | What's your diet like? | Icon selector: meat-heavy / flexitarian / vegetarian / vegan | Food emissions |
| 4 | What's your home like? | Selector: apartment / small house / large house | Housing + energy emissions |
| 5 | How do you shop? | Selector: frequent / moderate / minimal | Consumption emissions |
| 6 | Have you flown this year? | Selector: 0 / 1-2 / 3+ round trips | Travel emissions |

Each tap subtly animates a footprint visual growing or shrinking — giving immediate micro-feedback. A progress bar shows how close they are to their reveal.

**What they feel:** Playful, fast, "this is different."

#### Step 3 — The Reveal: "Your FootPrint Story" (30-45 seconds)

A multi-card, swipeable reveal experience modeled after Spotify Wrapped. Six cards:

**Card 1 — Your Score**
The headline number: "Your footprint: 14.2 tons CO2/year." Accompanied by an evolving character visual (a tree, creature, or planet whose state reflects the score).
*Emotional beat: Curiosity — "Is that a lot?"*

**Card 2 — Your World**
Context: "That's 1.7 Earths of resources." A visual showing Earth(s) representing their consumption.
*Emotional beat: Realization — "Oh wow, that's tangible."*

**Card 3 — Your Breakdown**
Animated pie/bar chart: Food 28%, Transit 24%, Home 22%, Shopping 14%, Travel 12%. Interactive — tap a category for a one-line insight.
*Emotional beat: Insight — "I didn't know food was that big."*

**Card 4 — Your Rank**
Peer comparison: "You're in the 55th percentile in [city/region]." Framed neutrally — not shaming, just context.
*Emotional beat: Social comparison — "How do I stack up?"*

**Card 5 — Your Potential**
"Small changes could save 3.1 tons — that's 22%." Shows the gap between current and achievable.
*Emotional beat: Hope — "I can actually do something."*

**Card 6 — Your Character**
Meet their FootPrint avatar. Its health, mood, or growth stage reflects their score. This character will evolve as they improve.
*Emotional beat: Attachment — "I want to take care of this."*

#### Step 4 — First Action (30 seconds)

Immediately after the reveal: *"Want to see your biggest quick win?"*

The app surfaces the single highest-impact, lowest-effort swap from their data (e.g., "Try Meatless Monday → save 0.4 tons/year"). One tap to commit. This becomes their first weekly challenge.

**What they feel:** Empowerment — "That's doable."

#### Step 5 — Account Creation

Only *after* they've seen their full reveal and committed to an action does the app ask for sign-up: *"Save your FootPrint and start tracking."* Email or social auth. Friction is low because they're already invested.

**What they feel:** Willingness — "I want to keep this."

---

### Weekly Engagement Flow (Returning User)

**Goal:** Low-friction weekly ritual that builds habit and shows progress.

**Trigger:** Email notification on a consistent day (user-chosen): *"Your weekly check-in is ready."*

1. **Check-in (2-3 taps):** "How did your Meatless Monday go this week?" → thumbs up/down or quick slider. Optional: log any other changes ("I biked to work twice").
2. **Score update:** Footprint score adjusts based on check-in. Trend line updates. Character visual evolves.
3. **Progress feedback:** "You've saved 0.12 tons this month. Your footprint is now 13.8 tons." Celebrate milestones.
4. **New challenge offered:** A new personalized swap based on their next-biggest opportunity.
5. **Knowledge unlock:** A short article surfaces: "Did you know your bank might be funding fossil fuels?"
6. **Optional — Public challenge:** "Join the March No-Fast-Fashion Challenge" — opt-in, participation-only visibility.

**Cadence:** Weekly. Not daily (too much for newcomers), not monthly (too infrequent to build habit).

---

### Power User Flows

#### Deep Dive into Categories

A power user taps into their Food breakdown from the main dashboard. They see:

- Sub-category detail: Meat 45%, Dairy 20%, Packaged goods 15%, Food waste 12%, Dining out 8%
- Multiple "What if?" swap toggles, each showing projected score impact
- Links to relevant knowledge articles
- Ability to manually refine inputs ("I actually eat meat 3x/week, not daily")

Each manual refinement immediately recalculates their score and updates all comparisons.

#### Challenge Stacking

Power users can commit to multiple swaps simultaneously. Their dashboard shows all active challenges with individual progress. Completing challenges earns recognition and unlocks harder, higher-impact challenges.

#### Trend Analysis

After 4+ weeks of check-ins, a trend view unlocks showing:

- Score trajectory over time (line chart)
- Category-level trends (which areas improved, which didn't)
- Projected annual footprint at current pace
- Cumulative savings to date

#### Knowledge Library

Power users browse the full knowledge article library, filtered by category. Articles are:

- 2-3 minute reads max
- Written in plain language, no jargon
- End with 1-2 actionable takeaways
- Cite sources for credibility

#### Sharing & Social

Power users share specific moments:

- A "FootPrint Card" showing their latest score or a milestone
- Challenge participation badges
- Knowledge article links with their commentary
- All sharing is opt-in, and personal scores are only shared if the user explicitly chooses to

---

### Edge Cases

#### New User with Extremely High Footprint

A user answers the questionnaire and gets a score of 25+ tons (well above average). The app must not shame them. The reveal cards should emphasize the "potential" card more heavily: *"You have the biggest opportunity to make an impact — small changes for you mean huge savings."* Frame high footprint as high leverage, not failure.

#### New User with Very Low Footprint

A user already living sustainably scores 4-5 tons. The app should celebrate this, not make them feel like there's nothing to do: *"You're already in the top 5%. Here's how to go further — and how to help others get here too."* Surface collective action suggestions and sharing prompts.

#### User Who Never Checks In

After 2 missed weekly check-ins, send a gentle re-engagement email: *"Your FootPrint character misses you. Want a quick 30-second update?"* After 4 missed check-ins, reduce email frequency to monthly. Never spam. After 3 months of inactivity, send a "Your Year in Review" style summary to reignite interest.

#### User Who Disputes Their Estimate

Some users will feel their estimate is wrong ("I don't drive that much!"). Every category in the breakdown should have a "Refine this" option to manually adjust inputs. Show the data source: *"This estimate is based on EPA averages for your zip code and home type."* Transparency builds trust.

#### Incomplete Onboarding

User starts the questionnaire but drops off at question 3. Save their partial answers. If they return, resume where they left off. If they created an account, email after 24 hours: *"You're 3 questions away from your FootPrint reveal."*

#### User in an Unsupported Region

If the estimation engine has poor data for a given zip code or country, be transparent: *"We have limited data for your region. Your estimate uses national averages and may be less precise."* Allow manual refinement to compensate.

#### Privacy-Sensitive User

A user wants to use the app but is uncomfortable providing location data. Allow them to select a region broadly (state/country) instead of zip code. Degrade the peer comparison feature gracefully: *"For more precise benchmarking, add your zip code anytime."*

---

## Features & Requirements

### Core Features (MVP)

#### 1. Quick-Estimate Onboarding Engine

- 6-question swipeable questionnaire
- Animated micro-feedback on each answer (footprint visual responds)
- Progress indicator
- Partial save (resume if abandoned)
- No account required to complete
- Total time: under 90 seconds

#### 2. FootPrint Reveal ("Your FootPrint Story")

- 6-card Wrapped-style swipeable reveal
- Cards: Score, World Context, Breakdown, Peer Rank, Potential, Character
- Animated transitions between cards
- Shareable as a static "FootPrint Card" image
- Score calculated using EPA-backed estimation models keyed to user inputs

#### 3. Category Breakdown with "What If?" Swaps

- Dashboard showing footprint split by category (food, transit, home, shopping, travel, work/banking)
- Each category expandable to sub-categories
- "What if?" toggle on each sub-category showing impact of specific changes
- One-tap "Commit" to turn a swap into a tracked challenge
- Manual refinement inputs per category with immediate score recalculation

#### 4. Weekly Check-In System

- 2-3 tap check-in flow confirming challenge progress
- Score recalculation based on check-in responses
- Trend line updated on every check-in
- Milestone celebrations (animated, character-tied)
- Email-based notifications (user-selected day of week)
- Browser notification support where available (PWA)

#### 5. Score & Trend Tracking

- Single headline score (tons CO2/year)
- Earth-equivalents contextual score
- Peer percentile ranking by zip code
- Category-level scores
- Trend line (unlocks after 4+ weeks of data)
- Projected annual footprint at current pace
- Cumulative savings tracker

#### 6. Personalized Challenge System

- Challenges generated from "What if?" swaps the user commits to
- One active challenge minimum, multiple allowed
- Weekly progress tracking per challenge
- Challenge completion recognition
- Escalating challenge difficulty as easy wins are completed

#### 7. Public Challenges (Opt-In)

- App-wide themed challenges (e.g., "March Meatless Challenge")
- Participation is visible; personal scores are not
- Join/leave at any time
- Progress tracked within the challenge context
- Challenge results shareable

#### 8. Knowledge Articles

- 5-10 articles at launch, covering one per major category
- 2-3 minute read time max
- Plain language, no jargon
- Each article ends with 1-2 actionable takeaways
- Source citations for credibility
- Surfaced contextually after weekly check-ins and within category breakdowns
- Browsable library with category filters

#### 9. Character / Avatar System

- Visual character assigned during reveal (tree, creature, or planet-based)
- Character state reflects current score (health, growth stage, mood)
- Character evolves visibly as score improves over time
- Character reacts to check-ins and milestones
- Character appears on shareable FootPrint Cards

#### 10. Shareable FootPrint Cards

- Static image generation of key moments (reveal, milestones, challenge completion)
- Designed for social media sharing (Instagram story, Twitter, LinkedIn dimensions)
- User controls what is shared — score is only included if user opts in
- Includes My FootPrint branding for organic growth

#### 11. Partner Recommendations

- Vetted sustainability partners surfaced within "What if?" swaps
- Contextual placement: only shown when relevant to a swap the user is exploring
- Transparency badge: "Paid partnership" label on every partner recommendation
- Partner vetting criteria published publicly
- Partners must demonstrably reduce emissions in the relevant category
- Users can dismiss or hide partner recommendations

#### 12. User Accounts & Data Persistence

- Email or social auth (Google, Apple)
- All questionnaire answers, scores, check-ins, and challenge history persisted
- Account deletion with full data removal
- No account required to see initial reveal (account required to save and continue)

---

### Technical Requirements

- **Web application** (responsive, mobile-friendly, desktop-supported)
- **Target load time:** < 2 seconds for initial page, < 500ms for in-app navigation
- **Estimation engine:** Server-side calculation using EPA emissions factors, academic models, and regional data
- **Offline tolerance:** Check-in data should queue and sync when connectivity returns
- **Email delivery:** Transactional email for weekly check-ins and re-engagement
- **Image generation:** Server-side or client-side rendering for shareable FootPrint Cards
- **Analytics:** Event tracking for onboarding completion rates, check-in frequency, challenge engagement, and drop-off points
- **Accessibility:** WCAG 2.1 AA compliance — screen reader support, keyboard navigation, color contrast ratios
- **Browser support:** Latest 2 versions of Chrome, Safari, Firefox, Edge

### Constraints

- **No real-time data integrations in V1.** All footprint data comes from user inputs + estimation models. No bank linking, no utility APIs, no location tracking.
- **No native mobile app in V1.** Web-first. PWA capabilities (home screen install, push notifications) where supported.
- **Estimation accuracy is approximate.** The engine uses regional averages and published emissions factors. It will not match a professional carbon audit. This must be communicated clearly to users.
- **Partnership revenue requires scale.** The partner model won't generate meaningful revenue until the user base reaches critical mass. Plan for a runway period where the app is cost-center only.
- **Knowledge articles require editorial effort.** 5-10 at launch, written in-house. Scaling the library requires a content pipeline.
- **Public challenges require minimum participation.** A challenge with 3 participants feels dead. Either seed with internal team or gate the feature until user base supports it.

---

## UX/Design Direction

> Full design system with tokens, component patterns, and the reusable Claude `<frontend_aesthetics>` prompt lives in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

### Aesthetic Style

**In a phrase: Vibrant maximalist meets warm naturalism.**

Think Spotify Wrapped's boldness married to a botanical print studio. Every screen should feel like a poster worth screenshotting. The tension between earthy warmth and electric data visualization IS the brand. Not neon-tech. Not granola-quiet. Something uniquely in between.

- **Bold typography hierarchy** — Clash Display headlines with extreme 3-5x size jumps. Data in monospace (JetBrains Mono). Numbers are first-class visual citizens.
- **Soft watercolor illustrations** — category-specific nature scenes (leaves for food, hills for transit) as ambient backgrounds at 8-15% opacity. Loose, painterly, organic.
- **Snappy micro-interactions** — every tap feels satisfying. Buttons scale on press with spring-back. Toggles snap with overshoot. Cards lift on hover. No ambient animations — motion is always in response to user action.
- **Generous whitespace** — content breathes. Minimum 24px padding. Card-based layout.
- **Photography (if used):** Warm, hopeful nature imagery. No doom-and-gloom polar bears on melting ice.

### Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Base | Warm Sand | `#F5F0E8` | Primary background — warm, not sterile |
| Surface | Light Sage | `#E8E0D0` | Card backgrounds, containers |
| Primary | Deep Forest | `#2D5016` | Headlines, icons, primary text |
| Secondary | Terracotta | `#C4956A` | Secondary elements, borders, tags |
| Accent | Electric Green | `#00E676` | Scores, CTAs, progress, positive change — the ONE bright color |
| Text | Near Black | `#1A1A18` | Body text |
| Text Muted | Stone Gray | `#7A7A6E` | Labels, metadata, supporting text |
| Negative | Soft Coral | `#E57373` | Negative change, alerts (used sparingly) |
| Celebration | Golden Yellow | `#FFD54F` | Milestones, confetti, achievements |

**Strategy:** Warm earth tones with ONE electric exception. The electric green is a signal flare on a calm landscape — used sparingly for scores, CTAs, and positive deltas only. It pops because everything else is muted.

**Dark mode:** Not in V1 scope.

### Interaction Patterns

#### Navigation

- **Bottom tab bar** (mobile viewport) / **sidebar** (desktop): Home (dashboard), Explore (breakdowns + swaps), Challenges, Learn (articles), Profile
- Minimal depth — most actions reachable in 1-2 taps from the dashboard
- No hamburger menus. Key navigation always visible.

#### Onboarding Questionnaire

- **Swipe-based cards** — one question per screen, full-width
- Large tap targets for answer options (icon + label, not small radio buttons)
- Swipe right or tap to advance. Swipe left to go back
- Animated footprint visual responds to each answer in real-time
- Progress dots at the top, not a progress bar (less anxiety-inducing)

#### The Reveal

- **Full-screen swipeable cards** — immersive, no navigation chrome visible
- Each card animates in with a staggered entrance (numbers count up, charts draw in)
- Haptic feedback on milestone numbers (where supported)
- Final card has a clear CTA: "See your first quick win"
- "Share" button available on each card (generates a static image)

#### Dashboard (Post-Onboarding Home)

- **Hero: Current score** with character visual and trend arrow (up/down from last week)
- **Active challenges** as horizontal scrollable cards
- **Weekly check-in prompt** (prominent when due, dismissible after completion)
- **Category breakdown** as tappable cards below the fold
- **Latest knowledge article** teaser at the bottom

#### "What If?" Swaps

- **Toggle-style interaction:** User flips a switch next to a swap ("Bike to work 2 days/week")
- Score impact animates in real-time: "-0.8 tons/year" with the total score visually adjusting
- Multiple swaps can be toggled simultaneously to see cumulative impact
- "Commit" button locks in selected swaps as tracked challenges

#### Celebrations & Milestones

- **Full-screen animated moment** when a user hits a milestone (first check-in, first ton saved, streak)
- Character reacts (grows, dances, glows)
- Confetti or particle effects — brief, delightful, not obnoxious
- Shareable milestone card generated automatically
- Sound effects: off by default, toggleable in settings

#### Feedback & Tone

- **Never use guilt language.** "You could save" not "You're wasting." "Your biggest opportunity" not "Your worst category."
- **Celebrate effort, not perfection.** "3 weeks in a row!" matters more than "You're at 8 tons."
- **Explain jargon inline.** First use of "tons of CO2" should have a tooltip: "That's like driving 12,000 miles."
- **Error states are friendly.** "Something went wrong — we'll have this fixed soon" with the character looking sheepish.

---

## Technical Considerations

### Data Model

#### User

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | string | Unique, used for auth |
| display_name | string | Optional, used in public challenges |
| zip_code | string | Nullable (privacy option) |
| region | string | Fallback when zip not provided |
| created_at | timestamp | |
| last_check_in | timestamp | Null until first check-in |
| onboarding_complete | boolean | True after reveal viewed |
| notification_day | enum (mon-sun) | Preferred check-in day |
| character_type | string | Avatar assigned during reveal |

#### FootprintProfile

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| diet_type | enum | meat_heavy, flexitarian, vegetarian, vegan |
| transit_mode | enum | car, transit, bike, walk, mix |
| home_type | enum | apartment, small_house, large_house |
| shopping_frequency | enum | frequent, moderate, minimal |
| flights_per_year | enum | none, one_to_two, three_plus |
| custom_overrides | JSONB | Manual refinements per sub-category |
| updated_at | timestamp | |

#### FootprintScore

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| total_tons | decimal | Total annual CO2e in metric tons |
| earth_equivalents | decimal | Calculated from total_tons |
| percentile_rank | integer | 0-100, relative to zip/region peers |
| breakdown | JSONB | `{ food: 4.2, transit: 3.8, home: 3.1, ... }` |
| calculated_at | timestamp | |
| source | enum | initial_estimate, check_in_update, manual_refinement |

#### Challenge

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| category | string | food, transit, home, shopping, travel |
| title | string | "Try Meatless Monday" |
| description | string | |
| impact_tons | decimal | Projected annual savings |
| status | enum | active, completed, abandoned |
| started_at | timestamp | |
| completed_at | timestamp | Nullable |

#### CheckIn

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| week_of | date | Monday of the check-in week |
| challenge_progress | JSONB | `{ challenge_id: "thumbs_up" / "thumbs_down" }` |
| additional_notes | JSONB | Any extra logged changes |
| created_at | timestamp | |

#### PublicChallenge

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | string | "March Meatless Challenge" |
| description | string | |
| category | string | |
| start_date | date | |
| end_date | date | |
| participant_count | integer | Denormalized for display |

#### PublicChallengeParticipant

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| public_challenge_id | UUID | FK → PublicChallenge |
| user_id | UUID | FK → User |
| joined_at | timestamp | |
| status | enum | active, completed, left |

#### KnowledgeArticle

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | string | |
| slug | string | URL-friendly identifier |
| category | string | food, transit, home, shopping, travel, banking |
| body | text | Markdown or rich text |
| read_time_minutes | integer | Target: 2-3 |
| takeaways | JSONB | Array of actionable takeaway strings |
| sources | JSONB | Array of `{ title, url }` |
| published_at | timestamp | |

#### Partner

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | |
| category | string | |
| description | string | |
| impact_claim | string | "Reduces banking emissions by 40%" |
| url | string | Referral link |
| vetting_status | enum | approved, pending, rejected |
| transparency_note | string | Displayed to users |

#### Relationships

```
User 1 ←→ 1 FootprintProfile
User 1 ←→ N FootprintScore (history)
User 1 ←→ N Challenge
User 1 ←→ N CheckIn
User N ←→ N PublicChallenge (via PublicChallengeParticipant)
Challenge N ←→ 1 Category
KnowledgeArticle N ←→ 1 Category
Partner N ←→ 1 Category
```

### APIs Needed

#### Internal APIs (Build)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Create account (email or social) |
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/social` | POST | OAuth callback handler |
| `/api/profile` | GET/PUT | Get or update footprint profile inputs |
| `/api/score/calculate` | POST | Run estimation engine on profile, return score |
| `/api/score/history` | GET | Get score history for trend display |
| `/api/challenges` | GET/POST | List or create personal challenges |
| `/api/challenges/:id` | PUT | Update challenge status |
| `/api/checkins` | GET/POST | List or submit weekly check-ins |
| `/api/public-challenges` | GET | List available public challenges |
| `/api/public-challenges/:id/join` | POST | Join a public challenge |
| `/api/public-challenges/:id/leave` | POST | Leave a public challenge |
| `/api/articles` | GET | List knowledge articles (filterable by category) |
| `/api/articles/:slug` | GET | Get single article |
| `/api/partners` | GET | List approved partners (filterable by category) |
| `/api/share/card` | POST | Generate shareable FootPrint Card image |
| `/api/benchmarks/:zip` | GET | Get peer benchmarks for a zip code/region |

#### External APIs / Data Sources (Consume)

| Source | Purpose | Notes |
|---|---|---|
| EPA Emissions Factors | Base calculation data for all categories | Published datasets, no API key needed. Update annually. |
| US Census / ACS | Regional demographic data for peer benchmarks | Public data. Zip-code-level averages. |
| eGRID (EPA) | Regional electricity grid carbon intensity | Maps zip code → grid region → emissions per kWh |
| Social auth providers | Google, Apple OAuth | Standard OAuth 2.0 flows |
| Transactional email service | Weekly check-in notifications, re-engagement | SendGrid, Postmark, or similar |
| Image generation | Shareable FootPrint Cards | Server-side rendering (e.g., Puppeteer/Satori) or canvas-based client-side |

#### No External APIs in V1

The following are explicitly **not** in V1 scope:

- Plaid (bank account linking)
- Utility company APIs
- Location/GPS services
- Social media posting APIs (share via native share sheet / URL copy only)

### Performance Requirements

| Metric | Target | Rationale |
|---|---|---|
| Initial page load (LCP) | < 2 seconds | Newcomers won't wait. First impression matters. |
| Time to interactive (TTI) | < 3 seconds | Questionnaire must be tappable immediately. |
| In-app navigation | < 500ms | Dashboard, breakdowns, and articles must feel instant. |
| Score calculation | < 1 second | Estimation engine response after questionnaire or refinement. |
| Reveal card transitions | 60fps | Animations are a core differentiator. Jank kills delight. |
| Share card generation | < 3 seconds | User taps "Share" and image should be ready quickly. |
| Weekly check-in submission | < 1 second | Confirm and update score near-instantly. |
| API response times (p95) | < 300ms | For all read endpoints. Write endpoints < 500ms. |
| Uptime | 99.5% | Acceptable for V1. Users check in weekly, not continuously. |
| Concurrent users | 1,000 | V1 target. Architecture should support 10x without rearchitecting. |
| Data retention | Indefinite | Score history and check-ins are the product. Never delete user data without request. |
| Mobile viewport performance | Smooth 60fps scrolling | Primary usage will be mobile browsers. Test on mid-range devices. |

---

*This is a living document. It will be updated as research continues, user testing reveals insights, and technical decisions are finalized.*
