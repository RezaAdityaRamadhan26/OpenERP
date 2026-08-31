import {
  DuplicateCodeError,
  InvalidParentCompanyError,
  OrganizationNotFoundError,
  OrganizationValidationError,
} from '../domain/errors.js';
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

export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) {}

  // ---------------------------------------------------------------------------
  // Company Use Cases
  // ---------------------------------------------------------------------------

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const code = data.code.trim().toUpperCase();
    const name = data.name.trim();

    if (!code) {
      throw new OrganizationValidationError('Company code cannot be empty');
    }
    if (!name) {
      throw new OrganizationValidationError('Company name cannot be empty');
    }

    const existing = await this.repository.findCompanyByCode(code);
    if (existing) {
      throw new DuplicateCodeError('Company', code);
    }

    return this.repository.createCompany({
      ...data,
      code,
      name,
    });
  }

  async getCompanyById(id: string): Promise<Company> {
    const company = await this.repository.findCompanyById(id);
    if (!company) {
      throw new OrganizationNotFoundError('Company', id);
    }
    return company;
  }

  async listCompanies(options?: ListOptions): Promise<{ items: Company[]; total: number }> {
    return this.repository.listCompanies(options);
  }

  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    await this.getCompanyById(id);
    if (data.name !== undefined && !data.name.trim()) {
      throw new OrganizationValidationError('Company name cannot be empty');
    }
    return this.repository.updateCompany(id, {
      ...data,
      name: data.name?.trim(),
    });
  }

  // ---------------------------------------------------------------------------
  // Branch Use Cases (strictly company scoped)
  // ---------------------------------------------------------------------------

  async createBranch(data: CreateScopedEntityData): Promise<Branch> {
    const code = data.code.trim().toUpperCase();
    const name = data.name.trim();

    if (!code) {
      throw new OrganizationValidationError('Branch code cannot be empty');
    }
    if (!name) {
      throw new OrganizationValidationError('Branch name cannot be empty');
    }

    const company = await this.repository.findCompanyById(data.companyId);
    if (!company || !company.isActive) {
      throw new InvalidParentCompanyError(data.companyId);
    }

    const existing = await this.repository.findBranchByCode(data.companyId, code);
    if (existing) {
      throw new DuplicateCodeError('Branch', code, data.companyId);
    }

    return this.repository.createBranch({
      ...data,
      code,
      name,
    });
  }

  async getBranchById(companyId: string, id: string): Promise<Branch> {
    const branch = await this.repository.findBranchById(companyId, id);
    if (!branch) {
      throw new OrganizationNotFoundError('Branch', id);
    }
    return branch;
  }

  async listBranches(companyId: string, options?: ListOptions): Promise<{ items: Branch[]; total: number }> {
    const company = await this.repository.findCompanyById(companyId);
    if (!company) {
      throw new OrganizationNotFoundError('Company', companyId);
    }
    return this.repository.listBranches(companyId, options);
  }

  async updateBranch(companyId: string, id: string, data: UpdateScopedEntityData): Promise<Branch> {
    await this.getBranchById(companyId, id);
    if (data.name !== undefined && !data.name.trim()) {
      throw new OrganizationValidationError('Branch name cannot be empty');
    }
    return this.repository.updateBranch(companyId, id, {
      ...data,
      name: data.name?.trim(),
    });
  }

  // ---------------------------------------------------------------------------
  // Department Use Cases (strictly company scoped)
  // ---------------------------------------------------------------------------

  async createDepartment(data: CreateScopedEntityData): Promise<Department> {
    const code = data.code.trim().toUpperCase();
    const name = data.name.trim();

    if (!code) {
      throw new OrganizationValidationError('Department code cannot be empty');
    }
    if (!name) {
      throw new OrganizationValidationError('Department name cannot be empty');
    }

    const company = await this.repository.findCompanyById(data.companyId);
    if (!company || !company.isActive) {
      throw new InvalidParentCompanyError(data.companyId);
    }

    const existing = await this.repository.findDepartmentByCode(data.companyId, code);
    if (existing) {
      throw new DuplicateCodeError('Department', code, data.companyId);
    }

    return this.repository.createDepartment({
      ...data,
      code,
      name,
    });
  }

  async getDepartmentById(companyId: string, id: string): Promise<Department> {
    const department = await this.repository.findDepartmentById(companyId, id);
    if (!department) {
      throw new OrganizationNotFoundError('Department', id);
    }
    return department;
  }

  async listDepartments(companyId: string, options?: ListOptions): Promise<{ items: Department[]; total: number }> {
    const company = await this.repository.findCompanyById(companyId);
    if (!company) {
      throw new OrganizationNotFoundError('Company', companyId);
    }
    return this.repository.listDepartments(companyId, options);
  }

  async updateDepartment(companyId: string, id: string, data: UpdateScopedEntityData): Promise<Department> {
    await this.getDepartmentById(companyId, id);
    if (data.name !== undefined && !data.name.trim()) {
      throw new OrganizationValidationError('Department name cannot be empty');
    }
    return this.repository.updateDepartment(companyId, id, {
      ...data,
      name: data.name?.trim(),
    });
  }

  // ---------------------------------------------------------------------------
  // Cost Center Use Cases (strictly company scoped)
  // ---------------------------------------------------------------------------

  async createCostCenter(data: CreateScopedEntityData): Promise<CostCenter> {
    const code = data.code.trim().toUpperCase();
    const name = data.name.trim();

    if (!code) {
      throw new OrganizationValidationError('Cost Center code cannot be empty');
    }
    if (!name) {
      throw new OrganizationValidationError('Cost Center name cannot be empty');
    }

    const company = await this.repository.findCompanyById(data.companyId);
    if (!company || !company.isActive) {
      throw new InvalidParentCompanyError(data.companyId);
    }

    const existing = await this.repository.findCostCenterByCode(data.companyId, code);
    if (existing) {
      throw new DuplicateCodeError('CostCenter', code, data.companyId);
    }

    return this.repository.createCostCenter({
      ...data,
      code,
      name,
    });
  }

  async getCostCenterById(companyId: string, id: string): Promise<CostCenter> {
    const costCenter = await this.repository.findCostCenterById(companyId, id);
    if (!costCenter) {
      throw new OrganizationNotFoundError('CostCenter', id);
    }
    return costCenter;
  }

  async listCostCenters(companyId: string, options?: ListOptions): Promise<{ items: CostCenter[]; total: number }> {
    const company = await this.repository.findCompanyById(companyId);
    if (!company) {
      throw new OrganizationNotFoundError('Company', companyId);
    }
    return this.repository.listCostCenters(companyId, options);
  }

  async updateCostCenter(companyId: string, id: string, data: UpdateScopedEntityData): Promise<CostCenter> {
    await this.getCostCenterById(companyId, id);
    if (data.name !== undefined && !data.name.trim()) {
      throw new OrganizationValidationError('Cost Center name cannot be empty');
    }
    return this.repository.updateCostCenter(companyId, id, {
      ...data,
      name: data.name?.trim(),
    });
  }
}
