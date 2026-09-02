export interface Company {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CostCenter {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCompanyInput = {
  code: string;
  name: string;
  isActive?: boolean;
};

export type UpdateCompanyInput = {
  name?: string;
  isActive?: boolean;
};

export type CreateBranchInput = {
  companyId: string;
  code: string;
  name: string;
  isActive?: boolean;
};

export type UpdateBranchInput = {
  name?: string;
  isActive?: boolean;
};

export type CreateDepartmentInput = {
  companyId: string;
  code: string;
  name: string;
  isActive?: boolean;
};

export type UpdateDepartmentInput = {
  name?: string;
  isActive?: boolean;
};

export type CreateCostCenterInput = {
  companyId: string;
  code: string;
  name: string;
  isActive?: boolean;
};

export type UpdateCostCenterInput = {
  name?: string;
  isActive?: boolean;
};
