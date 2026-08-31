import type { Branch, Company, CostCenter, Department } from './entities.js';

export interface CreateCompanyData {
  code: string;
  name: string;
  isActive?: boolean;
}

export interface UpdateCompanyData {
  name?: string;
  isActive?: boolean;
}

export interface CreateScopedEntityData {
  companyId: string;
  code: string;
  name: string;
  isActive?: boolean;
}

export interface UpdateScopedEntityData {
  name?: string;
  isActive?: boolean;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}

export interface OrganizationRepository {
  // Company
  createCompany(data: CreateCompanyData): Promise<Company>;
  findCompanyById(id: string): Promise<Company | null>;
  findCompanyByCode(code: string): Promise<Company | null>;
  listCompanies(options?: ListOptions): Promise<{ items: Company[]; total: number }>;
  updateCompany(id: string, data: UpdateCompanyData): Promise<Company>;

  // Branch (strictly company-scoped)
  createBranch(data: CreateScopedEntityData): Promise<Branch>;
  findBranchById(companyId: string, id: string): Promise<Branch | null>;
  findBranchByCode(companyId: string, code: string): Promise<Branch | null>;
  listBranches(companyId: string, options?: ListOptions): Promise<{ items: Branch[]; total: number }>;
  updateBranch(companyId: string, id: string, data: UpdateScopedEntityData): Promise<Branch>;

  // Department (strictly company-scoped)
  createDepartment(data: CreateScopedEntityData): Promise<Department>;
  findDepartmentById(companyId: string, id: string): Promise<Department | null>;
  findDepartmentByCode(companyId: string, code: string): Promise<Department | null>;
  listDepartments(companyId: string, options?: ListOptions): Promise<{ items: Department[]; total: number }>;
  updateDepartment(companyId: string, id: string, data: UpdateScopedEntityData): Promise<Department>;

  // Cost Center (strictly company-scoped)
  createCostCenter(data: CreateScopedEntityData): Promise<CostCenter>;
  findCostCenterById(companyId: string, id: string): Promise<CostCenter | null>;
  findCostCenterByCode(companyId: string, code: string): Promise<CostCenter | null>;
  listCostCenters(companyId: string, options?: ListOptions): Promise<{ items: CostCenter[]; total: number }>;
  updateCostCenter(companyId: string, id: string, data: UpdateScopedEntityData): Promise<CostCenter>;
}
