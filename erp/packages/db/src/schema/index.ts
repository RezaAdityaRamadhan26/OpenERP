import {
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * Minimal infrastructure table to verify migration tooling works.
 * Preserved for foundation check.
 */
export const migrationsCheck = pgTable('_migrations_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: varchar('description', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Companies table - top level organization tenant entity.
 */
export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    code: varchar('code', { length: 64 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    codeUnique: uniqueIndex('companies_code_unique_idx').on(table.code),
    activeIndex: index('companies_is_active_idx').on(table.is_active),
  }),
);

/**
 * Branches table - physical or operational branch of a company.
 */
export const branches = pgTable(
  'branches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company_id: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'restrict' }),
    code: varchar('code', { length: 64 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    companyCodeUnique: uniqueIndex('branches_company_code_unique_idx').on(
      table.company_id,
      table.code,
    ),
    companyIndex: index('branches_company_id_idx').on(table.company_id),
    activeIndex: index('branches_is_active_idx').on(table.is_active),
  }),
);

/**
 * Departments table - functional department within a company.
 */
export const departments = pgTable(
  'departments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company_id: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'restrict' }),
    code: varchar('code', { length: 64 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    companyCodeUnique: uniqueIndex('departments_company_code_unique_idx').on(
      table.company_id,
      table.code,
    ),
    companyIndex: index('departments_company_id_idx').on(table.company_id),
    activeIndex: index('departments_is_active_idx').on(table.is_active),
  }),
);

/**
 * Cost Centers table - accounting and budgeting cost allocation entity.
 */
export const costCenters = pgTable(
  'cost_centers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company_id: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'restrict' }),
    code: varchar('code', { length: 64 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    companyCodeUnique: uniqueIndex('cost_centers_company_code_unique_idx').on(
      table.company_id,
      table.code,
    ),
    companyIndex: index('cost_centers_company_id_idx').on(table.company_id),
    activeIndex: index('cost_centers_is_active_idx').on(table.is_active),
  }),
);
