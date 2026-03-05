# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy env vars for build (not used at runtime)
ENV NEXT_TELEMETRY_DISABLED=1
ENV CLERK_SECRET_KEY=dummy_for_build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=dummy_for_build
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV RESEND_API_KEY=re_dummy_for_build
ENV CRON_SECRET=dummy_for_build

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/content ./content

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
