export interface Company {
  id: string;
  code: string;
  name: string;
  legal_name: string | null;
  tax_id: string | null;
  currency: string;
  timezone: string;
  fiscal_year_start_month: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  company_id: string;
  branch_id: string | null;
  parent_id: string | null;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  company_id: string;
  department_id: string | null;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateCompanyInput = {
  code: string;
  name: string;
  legal_name?: string | null;
  tax_id?: string | null;
  currency: string;
  timezone: string;
  fiscal_year_start_month: number;
  is_active?: boolean;
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export type CreateBranchInput = {
  company_id: string;
  code: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  is_active?: boolean;
};

export type UpdateBranchInput = Partial<CreateBranchInput>;

export type CreateDepartmentInput = {
  company_id: string;
  branch_id?: string | null;
  parent_id?: string | null;
  code: string;
  name: string;
  is_active?: boolean;
};

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export type CreateCostCenterInput = {
  company_id: string;
  department_id?: string | null;
  code: string;
  name: string;
  is_active?: boolean;
};

export type UpdateCostCenterInput = Partial<CreateCostCenterInput>;
