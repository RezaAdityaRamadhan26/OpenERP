import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

let clientInstance: ReturnType<typeof postgres> | undefined;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getClient(databaseUrl: string) {
  if (!clientInstance) {
    clientInstance = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return clientInstance;
}

export function getDb(databaseUrl: string) {
  if (!dbInstance) {
    const client = getClient(databaseUrl);
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (clientInstance) {
    await clientInstance.end();
    clientInstance = undefined;
    dbInstance = undefined;
  }
}
