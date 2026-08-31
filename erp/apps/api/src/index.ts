import { loadEnv } from '@open-erp/config';
import { createApp } from './app.js';

const env = loadEnv();
const app = createApp({ corsOrigin: env.CORS_ORIGIN });

console.log(`API server starting on ${env.API_HOST}:${env.API_PORT}`);

export default {
  port: env.API_PORT,
  hostname: env.API_HOST,
  fetch: app.fetch,
};
