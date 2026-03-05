# Decision Log

All key decisions made during the design, architecture, and implementation of My FootPrint.

---

## Product Decisions

| # | Decision | Options Considered | Chosen | Rationale | Phase |
|---|----------|--------------------|--------|-----------|-------|
| P1 | Target user | Climate activists, Climate-curious newcomers, Budget-conscious savers, Parents/families | **Climate-curious newcomers** | Largest addressable audience; activists already have tools; newcomers need the most onboarding help | Research |
| P2 | Onboarding approach | Full audit (20+ questions), Quick estimate then refine, Skip to dashboard | **Quick estimate then refine** | Balances accuracy with conversion; 5-6 questions in 60 seconds, refine later | Research |
| P3 | Score framing | Single number, Letter grade, Comparison only, Custom | **5-6 data points (Spotify Wrapped style)** | Score + character + impact potential + personal budget + category breakdown; more engaging than a single number | Research |
| P4 | Core engagement loop | Daily tips, Weekly check-in + challenges, Monthly recalculation | **Weekly check-in + challenges** | Weekly cadence is sustainable; challenges add gamification without daily notification fatigue | Research |
| P5 | Social model | Fully private, Public leaderboard, Hybrid | **Hybrid: private score, public challenges** | Avoids shame/comparison while enabling community motivation through shared challenges | Research |
| P6 | Data strategy | Manual logging only, Estimation engine + manual refinement, Bank/utility API integration | **Estimation engine + manual refinement** | EPA-backed estimation gives instant value; manual refinement adds accuracy over time; no API complexity for prototype | Research |
| P7 | Platform | Web app first, Mobile app first, Both simultaneously | **Web app first, mobile later** | Faster iteration, lower cost, broader reach for MVP; PWA possible later | Research |
| P8 | Alternatives presentation | Separate recommendations page, Contextual swaps in breakdown, AI-generated suggestions | **Contextual "What if?" swaps in breakdowns** | In-context is more actionable; users see impact immediately where they're already looking | Research |
| P9 | Monetization | Freemium, Ads, Fully free with partnerships | **Fully free, monetize through partnerships** | Removes friction for climate-curious newcomers; partnerships align with mission | Research |
| P10 | Nice-to-have features | Include stretch features, MVP only | **No nice-to-haves** | Focus on core 12 features for prototype; avoid scope creep | PRD |

## Design Decisions

| # | Decision | Options Considered | Chosen | Rationale | Phase |
|---|----------|--------------------|--------|-----------|-------|
| D1 | Design mood | Clean minimal, Vibrant maximalist, Dark/techy, Playful/illustrated | **Vibrant maximalist (Spotify Wrapped energy)** | Matches the Wrapped-style reveal; creates emotional engagement with climate data | Design |
| D2 | Typography | System fonts, Inter + mono, Clash Display + mono | **Clash Display + JetBrains Mono + Space Grotesk** | Clash Display for bold headlines, JetBrains Mono for data, Space Grotesk for body; creates visual hierarchy | Design |
| D3 | Color strategy | Cool blues/greens, Warm earth tones + pop, Monochrome + accent | **Warm earth tones + electric green (#00E676)** | Earth tones ground the climate theme; electric green (#00E676) creates energy and draws attention to CTAs | Design |
| D4 | Animation approach | No animation, Snappy micro-interactions, Cinematic transitions | **Snappy micro-interactions** | 150-300ms spring physics; feels responsive without being slow; matches maximalist energy | Design |
| D5 | Background style | Solid colors, Gradients, Illustrated nature scenes | **Illustrated nature scenes (soft watercolor)** | Watercolor blobs at low opacity create organic feel without overwhelming content | Design |
| D6 | Illustration style | Flat/geometric, 3D renders, Soft watercolor/organic | **Soft watercolor/organic** | Complements earth tone palette; feels approachable and non-corporate | Design |

## Architecture Decisions

| # | Decision | Options Considered | Chosen | Rationale | Phase |
|---|----------|--------------------|--------|-----------|-------|
| A1 | Auth provider | NextAuth.js, Clerk, Supabase Auth, Custom | **Clerk** | Pre-built UI components, Google + Apple OAuth out of box, client-side anonymous pattern, webhook support | Architecture |
| A2 | Database | Supabase, PlanetScale, Neon PostgreSQL | **Neon PostgreSQL** | Full PostgreSQL with JSONB, serverless scale-to-zero, native Vercel integration, Drizzle driver support | Architecture |
| A3 | ORM | Prisma, Drizzle, Raw SQL | **Drizzle ORM** | 7KB bundle size, type-safe, dedicated Neon serverless driver, SQL-like API | Architecture |
| A4 | Article storage | Database (CMS), MDX files in repo, External CMS | **MDX files in repo** | No CMS overhead, version controlled, next-mdx-remote for rendering, gray-matter for frontmatter | Architecture |
| A5 | State management | React Context, Redux, Zustand | **Zustand with persist middleware** | Minimal boilerplate, localStorage persistence for anonymous onboarding, 1KB bundle | Architecture |
| A6 | Animation library | CSS transitions, Framer Motion, Motion | **Motion (formerly Framer Motion)** | LazyMotion for bundle optimization, spring physics, AnimatePresence for exit animations | Architecture |
| A7 | Charts | Chart.js, D3, Recharts | **Recharts** | React-native components, responsive, good defaults, supports line/area/pie charts needed | Architecture |
| A8 | Email service | SendGrid, Postmark, Resend | **Resend** | React Email integration (JSX templates), simple API, good DX, modern SDK | Architecture |
| A9 | Carousel | Swiper, Custom, Embla Carousel | **Embla Carousel** | Lightweight, accessible, touch-friendly, headless (style however we want) | Architecture |
| A10 | Deployment | AWS, Railway, Vercel | **Vercel** | Native Next.js support, edge functions, cron jobs, Neon integration, preview deployments | Architecture |
| A11 | CSS framework | CSS Modules, Styled Components, Tailwind CSS v4 | **Tailwind CSS v4** | @theme directive for design tokens, JIT compilation, utility-first matches component-heavy architecture | Architecture |
| A12 | Validation | Yup, Joi, Zod | **Zod v4** | TypeScript-first, tiny bundle, schema inference, works on server and client | Architecture |
| A13 | ID generation | UUID, cuid, nanoid | **nanoid** | 108 bytes, URL-safe, fast, collision-resistant | Architecture |
| A14 | Next.js output | Default, Standalone | **Standalone** | Required for Docker deployment; produces minimal server bundle | Architecture |

## Implementation Decisions

| # | Decision | Options Considered | Chosen | Rationale | Phase |
|---|----------|--------------------|--------|-----------|-------|
| I1 | Execution strategy | Sequential phases, Parallel agents, Single developer | **Parallel specialist agents (claude-flow)** | 13 specialist agents, 10 phases, parallelized independent tracks for throughput | Implementation |
| I2 | EPA data format | Database seeding, Static JSON files, API calls | **Static JSON files in src/data/emissions/** | No database needed for reference data; faster reads; works before auth; easy to update | Phase 3 |
| I3 | Onboarding answer values | snake_case matching engine, kebab-case for UI | **kebab-case in UI, mapped to engine format** | UI uses user-friendly values (car-solo, meat-heavy); mapAnswersToInput translates for the engine | Phase 4 |
| I4 | Results reveal pattern | Show all at once, One card at a time, Staggered accumulating | **Staggered accumulating cards** | Each card appears with spring animation and stays visible; creates Spotify Wrapped progression feel | Phase 4 |
| I5 | Flights default | Ask in onboarding, Skip entirely, Default to average | **Default to 'one_to_two'** | 6-question limit means no flights question; middle-ground assumption; can refine later in profile | Phase 4 |
| I6 | Check-in frequency | Daily, Weekly, Bi-weekly | **Weekly (Monday-start weeks)** | Matches the weekly engagement loop decision; not too frequent to cause fatigue | Phase 6 |
| I7 | Check-in deduplication | Allow multiple per week, One per week | **One per week (409 if duplicate)** | Prevents gaming/confusion; shows summary if already checked in | Phase 6 |
| I8 | Trends mock data | Empty state, Realistic mock, Database only | **Realistic mock data (12 weeks, declining)** | Shows the UI potential immediately; all marked with TODO for DB wiring | Phase 6 |
| I9 | Email cron schedule | Daily, Weekly Monday, Weekly Sunday | **Monday 9 AM UTC** | Start of week aligns with check-in cadence; 9 AM catches most US timezones in morning | Phase 8 |
| I10 | Docker DB connection at build | Fail (no DB), Dummy DATABASE_URL | **Dummy DATABASE_URL + force-dynamic on all DB routes** | Prevents Neon client from connecting during build; routes are server-rendered on demand only | Phase 10 |
| I11 | Test environment for Zustand | No persist in tests, Mock localStorage | **Mock localStorage in test setup** | Zustand persist middleware requires localStorage; jsdom's implementation was incomplete | Phase 9 |
| I12 | React Email Preview type | String interpolation in JSX, Template literal | **Template literal in curly braces** | `<Preview>` component expects `ReactNode & string`; template literal `{``}` satisfies the type | Phase 8/10 |

## Technical Debt & Future Considerations

| Item | Context | Priority |
|------|---------|----------|
| Household size unused | Collected in onboarding but engine has no per-capita factor | Low — add when expanding engine |
| Mock data in trends/dashboard | Hardcoded scores and category data | High — wire to DB after Neon setup |
| Clerk webhook DB wiring | Handler exists but user create/delete has TODO | High — needed for production |
| Article images | MDX articles reference no images | Medium — add when content is finalized |
| PWA support | No service worker or manifest | Low — add for mobile-like experience |
| Accessibility audit | Components have basic aria but no full audit | Medium — do before public launch |
| Rate limiting | No rate limiting on public API routes | Medium — add before production |
| Error monitoring | No Sentry or similar | Medium — add before production |
