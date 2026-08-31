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

const API_BASE = '/api/v1/organization';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed: ${res.statusText} (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error?.message) {
        errorMsg = errJson.error.message;
      }
    } catch {
      // JSON parse failed, use fallback errorMsg
    }
    throw new Error(errorMsg);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error('API returned unsuccesful response');
  }
  return json.data;
}

export const organizationApi = {
  // Companies
  getCompanies: async (): Promise<Company[]> => {
    const res = await fetch(`${API_BASE}/companies`);
    return handleResponse<Company[]>(res);
  },
  getCompany: async (id: string): Promise<Company> => {
    const res = await fetch(`${API_BASE}/companies/${id}`);
    return handleResponse<Company>(res);
  },
  createCompany: async (input: CreateCompanyInput): Promise<Company> => {
    const res = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Company>(res);
  },
  updateCompany: async (id: string, input: UpdateCompanyInput): Promise<Company> => {
    const res = await fetch(`${API_BASE}/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Company>(res);
  },
  toggleCompanyActive: async (id: string, is_active: boolean): Promise<Company> => {
    return organizationApi.updateCompany(id, { is_active });
  },

  // Branches
  getBranches: async (companyId?: string): Promise<Branch[]> => {
    const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
    const res = await fetch(`${API_BASE}/branches${query}`);
    return handleResponse<Branch[]>(res);
  },
  getBranch: async (id: string): Promise<Branch> => {
    const res = await fetch(`${API_BASE}/branches/${id}`);
    return handleResponse<Branch>(res);
  },
  createBranch: async (input: CreateBranchInput): Promise<Branch> => {
    const res = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Branch>(res);
  },
  updateBranch: async (id: string, input: UpdateBranchInput): Promise<Branch> => {
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Branch>(res);
  },
  toggleBranchActive: async (id: string, is_active: boolean): Promise<Branch> => {
    return organizationApi.updateBranch(id, { is_active });
  },

  // Departments
  getDepartments: async (companyId?: string): Promise<Department[]> => {
    const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
    const res = await fetch(`${API_BASE}/departments${query}`);
    return handleResponse<Department[]>(res);
  },
  getDepartment: async (id: string): Promise<Department> => {
    const res = await fetch(`${API_BASE}/departments/${id}`);
    return handleResponse<Department>(res);
  },
  createDepartment: async (input: CreateDepartmentInput): Promise<Department> => {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Department>(res);
  },
  updateDepartment: async (id: string, input: UpdateDepartmentInput): Promise<Department> => {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Department>(res);
  },
  toggleDepartmentActive: async (id: string, is_active: boolean): Promise<Department> => {
    return organizationApi.updateDepartment(id, { is_active });
  },

  // Cost Centers
  getCostCenters: async (companyId?: string): Promise<CostCenter[]> => {
    const query = companyId ? `?company_id=${encodeURIComponent(companyId)}` : '';
    const res = await fetch(`${API_BASE}/cost-centers${query}`);
    return handleResponse<CostCenter[]>(res);
  },
  getCostCenter: async (id: string): Promise<CostCenter> => {
    const res = await fetch(`${API_BASE}/cost-centers/${id}`);
    return handleResponse<CostCenter>(res);
  },
  createCostCenter: async (input: CreateCostCenterInput): Promise<CostCenter> => {
    const res = await fetch(`${API_BASE}/cost-centers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<CostCenter>(res);
  },
  updateCostCenter: async (id: string, input: UpdateCostCenterInput): Promise<CostCenter> => {
    const res = await fetch(`${API_BASE}/cost-centers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<CostCenter>(res);
  },
  toggleCostCenterActive: async (id: string, is_active: boolean): Promise<CostCenter> => {
    return organizationApi.updateCostCenter(id, { is_active });
  },
};
