import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connectionString = process.env.DATABASE_URL;

// SSL configuration for production databases (like Render)
const sslConfig = {
  ssl: { rejectUnauthorized: false }
};

// For migrations
export const migrationClient = postgres(connectionString, { max: 1, ...sslConfig });

// For queries
const queryClient = postgres(connectionString, sslConfig);
export const db = drizzle(queryClient, { schema });
