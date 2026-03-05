import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

// Re-export all schema tables and relations for easy imports
export {
  users,
  footprintProfiles,
  footprintScores,
  challenges,
  checkIns,
  publicChallenges,
  publicChallengeParticipants,
  partners,
  usersRelations,
  footprintProfilesRelations,
  footprintScoresRelations,
  challengesRelations,
  checkInsRelations,
  publicChallengeParticipantsRelations,
} from './schema';
