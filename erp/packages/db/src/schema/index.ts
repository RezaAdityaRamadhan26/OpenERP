import { pgTable, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * Minimal infrastructure table to verify migration tooling works.
 * Not an ERP domain table — will be extended or replaced when
 * organization/IAM modules are implemented.
 */
export const migrationsCheck = pgTable('_migrations_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: varchar('description', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
