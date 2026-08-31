import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from './api.js';
import type {
  CreateBranchInput,
  CreateCompanyInput,
  CreateCostCenterInput,
  CreateDepartmentInput,
  UpdateBranchInput,
  UpdateCompanyInput,
  UpdateCostCenterInput,
  UpdateDepartmentInput,
} from './types.js';

export const organizationKeys = {
  all: ['organization'] as const,
  companies: () => [...organizationKeys.all, 'companies'] as const,
  company: (id: string) => [...organizationKeys.companies(), id] as const,
  branches: (companyId?: string) => [...organizationKeys.all, 'branches', { companyId }] as const,
  branch: (id: string) => [...organizationKeys.all, 'branches', id] as const,
  departments: (companyId?: string) => [...organizationKeys.all, 'departments', { companyId }] as const,
  department: (id: string) => [...organizationKeys.all, 'departments', id] as const,
  costCenters: (companyId?: string) => [...organizationKeys.all, 'costCenters', { companyId }] as const,
  costCenter: (id: string) => [...organizationKeys.all, 'costCenters', id] as const,
};

// Companies hooks
export function useCompanies() {
  return useQuery({
    queryKey: organizationKeys.companies(),
    queryFn: organizationApi.getCompanies,
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: organizationKeys.company(id),
    queryFn: () => organizationApi.getCompany(id),
    enabled: Boolean(id),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompanyInput) => organizationApi.createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.companies() });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCompanyInput }) =>
      organizationApi.updateCompany(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.companies() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.company(variables.id) });
    },
  });
}

export function useToggleCompanyActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      organizationApi.toggleCompanyActive(id, is_active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.companies() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.company(variables.id) });
    },
  });
}

// Branches hooks
export function useBranches(companyId?: string) {
  return useQuery({
    queryKey: organizationKeys.branches(companyId),
    queryFn: () => organizationApi.getBranches(companyId),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: organizationKeys.branch(id),
    queryFn: () => organizationApi.getBranch(id),
    enabled: Boolean(id),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBranchInput) => organizationApi.createBranch(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'branches'] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBranchInput }) =>
      organizationApi.updateBranch(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'branches'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.branch(variables.id) });
    },
  });
}

export function useToggleBranchActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      organizationApi.toggleBranchActive(id, is_active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'branches'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.branch(variables.id) });
    },
  });
}

// Departments hooks
export function useDepartments(companyId?: string) {
  return useQuery({
    queryKey: organizationKeys.departments(companyId),
    queryFn: () => organizationApi.getDepartments(companyId),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: organizationKeys.department(id),
    queryFn: () => organizationApi.getDepartment(id),
    enabled: Boolean(id),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => organizationApi.createDepartment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'departments'] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentInput }) =>
      organizationApi.updateDepartment(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'departments'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.department(variables.id) });
    },
  });
}

export function useToggleDepartmentActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      organizationApi.toggleDepartmentActive(id, is_active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'departments'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.department(variables.id) });
    },
  });
}

// Cost Centers hooks
export function useCostCenters(companyId?: string) {
  return useQuery({
    queryKey: organizationKeys.costCenters(companyId),
    queryFn: () => organizationApi.getCostCenters(companyId),
  });
}

export function useCostCenter(id: string) {
  return useQuery({
    queryKey: organizationKeys.costCenter(id),
    queryFn: () => organizationApi.getCostCenter(id),
    enabled: Boolean(id),
  });
}

export function useCreateCostCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCostCenterInput) => organizationApi.createCostCenter(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'costCenters'] });
    },
  });
}

export function useUpdateCostCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCostCenterInput }) =>
      organizationApi.updateCostCenter(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'costCenters'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.costCenter(variables.id) });
    },
  });
}

export function useToggleCostCenterActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      organizationApi.toggleCostCenterActive(id, is_active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...organizationKeys.all, 'costCenters'] });
      queryClient.invalidateQueries({ queryKey: organizationKeys.costCenter(variables.id) });
    },
  });
}
