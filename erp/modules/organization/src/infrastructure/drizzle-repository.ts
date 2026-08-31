import { and, count, desc, eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@open-erp/db/schema';
import type {
  Branch,
  Company,
  CostCenter,
  Department,
} from '../domain/entities.js';
import type {
  CreateCompanyData,
  CreateScopedEntityData,
  ListOptions,
  OrganizationRepository,
  UpdateCompanyData,
  UpdateScopedEntityData,
} from '../domain/repository.js';
import { OrganizationNotFoundError } from '../domain/errors.js';

export class DrizzleOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  // ---------------------------------------------------------------------------
  // Company
  // ---------------------------------------------------------------------------

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const [row] = await this.db
      .insert(schema.companies)
      .values({
        code: data.code,
        name: data.name,
        is_active: data.isActive ?? true,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create company');
    }

    return this.mapCompany(row);
  }

  async findCompanyById(id: string): Promise<Company | null> {
    const [row] = await this.db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, id))
      .limit(1);

    return row ? this.mapCompany(row) : null;
  }

  async findCompanyByCode(code: string): Promise<Company | null> {
    const [row] = await this.db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.code, code))
      .limit(1);

    return row ? this.mapCompany(row) : null;
  }

  async listCompanies(
    options: ListOptions = {},
  ): Promise<{ items: Company[]; total: number }> {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;

    const condition = options.includeInactive
      ? undefined
      : eq(schema.companies.is_active, true);

    const [totalRow] = await this.db
      .select({ val: count() })
      .from(schema.companies)
      .where(condition);

    const rows = await this.db
      .select()
      .from(schema.companies)
      .where(condition)
      .orderBy(desc(schema.companies.created_at))
      .limit(limit)
      .offset(offset);

    return {
      items: rows.map((r) => this.mapCompany(r)),
      total: totalRow ? Number(totalRow.val) : 0,
    };
  }

  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    const updateValues: Partial<typeof schema.companies.$inferInsert> = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.isActive !== undefined) updateValues.is_active = data.isActive;

    const [row] = await this.db
      .update(schema.companies)
      .set(updateValues)
      .where(eq(schema.companies.id, id))
      .returning();

    if (!row) {
      throw new OrganizationNotFoundError('Company', id);
    }

    return this.mapCompany(row);
  }

  // ---------------------------------------------------------------------------
  // Branch (scoped by companyId and id)
  // ---------------------------------------------------------------------------

  async createBranch(data: CreateScopedEntityData): Promise<Branch> {
    const [row] = await this.db
      .insert(schema.branches)
      .values({
        company_id: data.companyId,
        code: data.code,
        name: data.name,
        is_active: data.isActive ?? true,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create branch');
    }

    return this.mapBranch(row);
  }

  async findBranchById(companyId: string, id: string): Promise<Branch | null> {
    const [row] = await this.db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.company_id, companyId),
          eq(schema.branches.id, id),
        ),
      )
      .limit(1);

    return row ? this.mapBranch(row) : null;
  }

  async findBranchByCode(
    companyId: string,
    code: string,
  ): Promise<Branch | null> {
    const [row] = await this.db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.company_id, companyId),
          eq(schema.branches.code, code),
        ),
      )
      .limit(1);

    return row ? this.mapBranch(row) : null;
  }

  async listBranches(
    companyId: string,
    options: ListOptions = {},
  ): Promise<{ items: Branch[]; total: number }> {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;

    const condition = options.includeInactive
      ? eq(schema.branches.company_id, companyId)
      : and(
          eq(schema.branches.company_id, companyId),
          eq(schema.branches.is_active, true),
        );

    const [totalRow] = await this.db
      .select({ val: count() })
      .from(schema.branches)
      .where(condition);

    const rows = await this.db
      .select()
      .from(schema.branches)
      .where(condition)
      .orderBy(desc(schema.branches.created_at))
      .limit(limit)
      .offset(offset);

    return {
      items: rows.map((r) => this.mapBranch(r)),
      total: totalRow ? Number(totalRow.val) : 0,
    };
  }

  async updateBranch(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Branch> {
    const updateValues: Partial<typeof schema.branches.$inferInsert> = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.isActive !== undefined) updateValues.is_active = data.isActive;

    const [row] = await this.db
      .update(schema.branches)
      .set(updateValues)
      .where(
        and(
          eq(schema.branches.company_id, companyId),
          eq(schema.branches.id, id),
        ),
      )
      .returning();

    if (!row) {
      throw new OrganizationNotFoundError('Branch', id);
    }

    return this.mapBranch(row);
  }

  // ---------------------------------------------------------------------------
  // Department (scoped by companyId and id)
  // ---------------------------------------------------------------------------

  async createDepartment(data: CreateScopedEntityData): Promise<Department> {
    const [row] = await this.db
      .insert(schema.departments)
      .values({
        company_id: data.companyId,
        code: data.code,
        name: data.name,
        is_active: data.isActive ?? true,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create department');
    }

    return this.mapDepartment(row);
  }

  async findDepartmentById(
    companyId: string,
    id: string,
  ): Promise<Department | null> {
    const [row] = await this.db
      .select()
      .from(schema.departments)
      .where(
        and(
          eq(schema.departments.company_id, companyId),
          eq(schema.departments.id, id),
        ),
      )
      .limit(1);

    return row ? this.mapDepartment(row) : null;
  }

  async findDepartmentByCode(
    companyId: string,
    code: string,
  ): Promise<Department | null> {
    const [row] = await this.db
      .select()
      .from(schema.departments)
      .where(
        and(
          eq(schema.departments.company_id, companyId),
          eq(schema.departments.code, code),
        ),
      )
      .limit(1);

    return row ? this.mapDepartment(row) : null;
  }

  async listDepartments(
    companyId: string,
    options: ListOptions = {},
  ): Promise<{ items: Department[]; total: number }> {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;

    const condition = options.includeInactive
      ? eq(schema.departments.company_id, companyId)
      : and(
          eq(schema.departments.company_id, companyId),
          eq(schema.departments.is_active, true),
        );

    const [totalRow] = await this.db
      .select({ val: count() })
      .from(schema.departments)
      .where(condition);

    const rows = await this.db
      .select()
      .from(schema.departments)
      .where(condition)
      .orderBy(desc(schema.departments.created_at))
      .limit(limit)
      .offset(offset);

    return {
      items: rows.map((r) => this.mapDepartment(r)),
      total: totalRow ? Number(totalRow.val) : 0,
    };
  }

  async updateDepartment(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Department> {
    const updateValues: Partial<typeof schema.departments.$inferInsert> = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.isActive !== undefined) updateValues.is_active = data.isActive;

    const [row] = await this.db
      .update(schema.departments)
      .set(updateValues)
      .where(
        and(
          eq(schema.departments.company_id, companyId),
          eq(schema.departments.id, id),
        ),
      )
      .returning();

    if (!row) {
      throw new OrganizationNotFoundError('Department', id);
    }

    return this.mapDepartment(row);
  }

  // ---------------------------------------------------------------------------
  // Cost Center (scoped by companyId and id)
  // ---------------------------------------------------------------------------

  async createCostCenter(data: CreateScopedEntityData): Promise<CostCenter> {
    const [row] = await this.db
      .insert(schema.costCenters)
      .values({
        company_id: data.companyId,
        code: data.code,
        name: data.name,
        is_active: data.isActive ?? true,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create cost center');
    }

    return this.mapCostCenter(row);
  }

  async findCostCenterById(
    companyId: string,
    id: string,
  ): Promise<CostCenter | null> {
    const [row] = await this.db
      .select()
      .from(schema.costCenters)
      .where(
        and(
          eq(schema.costCenters.company_id, companyId),
          eq(schema.costCenters.id, id),
        ),
      )
      .limit(1);

    return row ? this.mapCostCenter(row) : null;
  }

  async findCostCenterByCode(
    companyId: string,
    code: string,
  ): Promise<CostCenter | null> {
    const [row] = await this.db
      .select()
      .from(schema.costCenters)
      .where(
        and(
          eq(schema.costCenters.company_id, companyId),
          eq(schema.costCenters.code, code),
        ),
      )
      .limit(1);

    return row ? this.mapCostCenter(row) : null;
  }

  async listCostCenters(
    companyId: string,
    options: ListOptions = {},
  ): Promise<{ items: CostCenter[]; total: number }> {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;

    const condition = options.includeInactive
      ? eq(schema.costCenters.company_id, companyId)
      : and(
          eq(schema.costCenters.company_id, companyId),
          eq(schema.costCenters.is_active, true),
        );

    const [totalRow] = await this.db
      .select({ val: count() })
      .from(schema.costCenters)
      .where(condition);

    const rows = await this.db
      .select()
      .from(schema.costCenters)
      .where(condition)
      .orderBy(desc(schema.costCenters.created_at))
      .limit(limit)
      .offset(offset);

    return {
      items: rows.map((r) => this.mapCostCenter(r)),
      total: totalRow ? Number(totalRow.val) : 0,
    };
  }

  async updateCostCenter(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<CostCenter> {
    const updateValues: Partial<typeof schema.costCenters.$inferInsert> = {
      updated_at: new Date(),
    };

    if (data.name !== undefined) updateValues.name = data.name;
    if (data.isActive !== undefined) updateValues.is_active = data.isActive;

    const [row] = await this.db
      .update(schema.costCenters)
      .set(updateValues)
      .where(
        and(
          eq(schema.costCenters.company_id, companyId),
          eq(schema.costCenters.id, id),
        ),
      )
      .returning();

    if (!row) {
      throw new OrganizationNotFoundError('CostCenter', id);
    }

    return this.mapCostCenter(row);
  }

  // ---------------------------------------------------------------------------
  // Mappers
  // ---------------------------------------------------------------------------

  private mapCompany(row: typeof schema.companies.$inferSelect): Company {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapBranch(row: typeof schema.branches.$inferSelect): Branch {
    return {
      id: row.id,
      companyId: row.company_id,
      code: row.code,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapDepartment(
    row: typeof schema.departments.$inferSelect,
  ): Department {
    return {
      id: row.id,
      companyId: row.company_id,
      code: row.code,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapCostCenter(
    row: typeof schema.costCenters.$inferSelect,
  ): CostCenter {
    return {
      id: row.id,
      companyId: row.company_id,
      code: row.code,
      name: row.name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
