// src/lib/db/schema.ts

import { pgTable, text, timestamp, boolean, decimal, integer, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -- Users --

export const users = pgTable('users', {
  id: text('id').primaryKey(),                    // nanoid
  clerkId: text('clerk_id').unique().notNull(),   // from Clerk webhook
  email: text('email').unique().notNull(),
  displayName: text('display_name'),
  zipCode: text('zip_code'),
  region: text('region'),
  onboardingComplete: boolean('onboarding_complete').default(false).notNull(),
  notificationDay: text('notification_day').default('monday').notNull(),
  characterType: text('character_type'),          // tree | creature | planet
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastCheckIn: timestamp('last_check_in'),
});

// -- Footprint Profile --

export const footprintProfiles = pgTable('footprint_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  dietType: text('diet_type').notNull(),          // meat_heavy | flexitarian | vegetarian | vegan
  transitMode: text('transit_mode').notNull(),    // car | transit | bike | walk | mix
  homeType: text('home_type').notNull(),          // apartment | small_house | large_house
  shoppingFrequency: text('shopping_frequency').notNull(), // frequent | moderate | minimal
  flightsPerYear: text('flights_per_year').notNull(),      // none | one_to_two | three_plus
  customOverrides: jsonb('custom_overrides').$type<Record<string, number>>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// -- Footprint Scores (history) --

export const footprintScores = pgTable('footprint_scores', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  totalTons: decimal('total_tons', { precision: 6, scale: 2 }).notNull(),
  earthEquivalents: decimal('earth_equivalents', { precision: 4, scale: 2 }).notNull(),
  percentileRank: integer('percentile_rank').notNull(),
  breakdown: jsonb('breakdown').$type<{
    food: number;
    transit: number;
    home: number;
    shopping: number;
    travel: number;
    work: number;
  }>().notNull(),
  source: text('source').notNull(),               // initial | check_in | refinement
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
});

// -- Challenges --

export const challenges = pgTable('challenges', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  impactTons: decimal('impact_tons', { precision: 5, scale: 3 }).notNull(),
  status: text('status').default('active').notNull(), // active | completed | abandoned
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// -- Check-Ins --

export const checkIns = pgTable('check_ins', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  weekOf: date('week_of').notNull(),
  challengeProgress: jsonb('challenge_progress').$type<Record<string, 'thumbs_up' | 'thumbs_down'>>(),
  additionalNotes: jsonb('additional_notes').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -- Public Challenges --

export const publicChallenges = pgTable('public_challenges', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  participantCount: integer('participant_count').default(0).notNull(),
});

export const publicChallengeParticipants = pgTable('public_challenge_participants', {
  id: text('id').primaryKey(),
  publicChallengeId: text('public_challenge_id').references(() => publicChallenges.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').default('active').notNull(), // active | completed | left
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// -- Partners --

export const partners = pgTable('partners', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  impactClaim: text('impact_claim').notNull(),
  url: text('url').notNull(),
  vettingStatus: text('vetting_status').default('pending').notNull(),
  transparencyNote: text('transparency_note').notNull(),
});

// -- Relations --

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(footprintProfiles),
  scores: many(footprintScores),
  challenges: many(challenges),
  checkIns: many(checkIns),
  publicChallengeParticipants: many(publicChallengeParticipants),
}));

export const footprintProfilesRelations = relations(footprintProfiles, ({ one }) => ({
  user: one(users, { fields: [footprintProfiles.userId], references: [users.id] }),
}));

export const footprintScoresRelations = relations(footprintScores, ({ one }) => ({
  user: one(users, { fields: [footprintScores.userId], references: [users.id] }),
}));

export const challengesRelations = relations(challenges, ({ one }) => ({
  user: one(users, { fields: [challenges.userId], references: [users.id] }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  user: one(users, { fields: [checkIns.userId], references: [users.id] }),
}));

export const publicChallengeParticipantsRelations = relations(publicChallengeParticipants, ({ one }) => ({
  publicChallenge: one(publicChallenges, { fields: [publicChallengeParticipants.publicChallengeId], references: [publicChallenges.id] }),
  user: one(users, { fields: [publicChallengeParticipants.userId], references: [users.id] }),
}));
