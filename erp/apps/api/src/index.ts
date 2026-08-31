import { loadEnv } from '@open-erp/config';
import { getDb } from '@open-erp/db';
import { DrizzleOrganizationRepository } from '@open-erp/organization';
import { createApp } from './app.js';

const env = loadEnv();
const db = getDb(env.DATABASE_URL);
const organizationRepository = new DrizzleOrganizationRepository(db);

const app = createApp({
  corsOrigin: env.CORS_ORIGIN,
  organizationRepository,
});

console.log(`API server starting on ${env.API_HOST}:${env.API_PORT}`);

export default {
  port: env.API_PORT,
  hostname: env.API_HOST,
  fetch: app.fetch,
};
