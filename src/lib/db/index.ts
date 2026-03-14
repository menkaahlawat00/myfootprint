import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let _db: NeonHttpDatabase<typeof schema> | null = null;

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    if (!_db) {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
      }
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle(sql, { schema });
    }
    return Reflect.get(_db, prop, receiver);
  },
});

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
