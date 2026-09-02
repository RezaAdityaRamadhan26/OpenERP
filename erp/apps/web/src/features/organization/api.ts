import type { ApiResponse } from '@open-erp/shared';
import type {
  Branch,
  Company,
  CostCenter,
  CreateBranchInput,
  CreateCompanyInput,
  CreateCostCenterInput,
  CreateDepartmentInput,
  Department,
  UpdateBranchInput,
  UpdateCompanyInput,
  UpdateCostCenterInput,
  UpdateDepartmentInput,
} from './types.js';

interface ListResult<T> {
  items: T[];
  total: number;
}

const API_BASE = '/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiResponse<T> | {
    success: false;
    error: { message: string };
  };

  if (!response.ok || !body.success) {
    throw new Error(body.success ? `Request failed: ${response.status}` : body.error.message);
  }

  return body.data;
}

function companyPath(companyId: string, resource: string): string {
  return `${API_BASE}/companies/${encodeURIComponent(companyId)}/${resource}`;
}

export const organizationApi = {
  getCompanies: async (): Promise<Company[]> => {
    const result = await handleResponse<ListResult<Company>>(await fetch(`${API_BASE}/companies?includeInactive=true`));
    return result.items;
  },
  getCompany: async (id: string): Promise<Company> =>
    handleResponse<Company>(await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`)),
  createCompany: async (input: CreateCompanyInput): Promise<Company> =>
    handleResponse<Company>(
      await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    ),
  updateCompany: async (id: string, input: UpdateCompanyInput): Promise<Company> =>
    handleResponse<Company>(
      await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    ),

  getBranches: async (companyId: string): Promise<Branch[]> => {
    const result = await handleResponse<ListResult<Branch>>(
      await fetch(`${companyPath(companyId, 'branches')}?includeInactive=true`),
    );
    return result.items;
  },
  createBranch: async (input: CreateBranchInput): Promise<Branch> => {
    const { companyId, ...body } = input;
    return handleResponse<Branch>(
      await fetch(companyPath(companyId, 'branches'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  },
  updateBranch: async (
    companyId: string,
    id: string,
    input: UpdateBranchInput,
  ): Promise<Branch> =>
    handleResponse<Branch>(
      await fetch(`${companyPath(companyId, 'branches')}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    ),

  getDepartments: async (companyId: string): Promise<Department[]> => {
    const result = await handleResponse<ListResult<Department>>(
      await fetch(`${companyPath(companyId, 'departments')}?includeInactive=true`),
    );
    return result.items;
  },
  createDepartment: async (input: CreateDepartmentInput): Promise<Department> => {
    const { companyId, ...body } = input;
    return handleResponse<Department>(
      await fetch(companyPath(companyId, 'departments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  },
  updateDepartment: async (
    companyId: string,
    id: string,
    input: UpdateDepartmentInput,
  ): Promise<Department> =>
    handleResponse<Department>(
      await fetch(`${companyPath(companyId, 'departments')}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    ),

  getCostCenters: async (companyId: string): Promise<CostCenter[]> => {
    const result = await handleResponse<ListResult<CostCenter>>(
      await fetch(`${companyPath(companyId, 'cost-centers')}?includeInactive=true`),
    );
    return result.items;
  },
  createCostCenter: async (input: CreateCostCenterInput): Promise<CostCenter> => {
    const { companyId, ...body } = input;
    return handleResponse<CostCenter>(
      await fetch(companyPath(companyId, 'cost-centers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  },
  updateCostCenter: async (
    companyId: string,
    id: string,
    input: UpdateCostCenterInput,
  ): Promise<CostCenter> =>
    handleResponse<CostCenter>(
      await fetch(`${companyPath(companyId, 'cost-centers')}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    ),
};
