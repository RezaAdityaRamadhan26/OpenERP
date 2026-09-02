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

const allKey = ['organization'] as const;
const companiesKey = [...allKey, 'companies'] as const;
const scopedKey = (resource: string, companyId: string) => [...allKey, resource, companyId] as const;

export function useCompanies() {
  return useQuery({ queryKey: companiesKey, queryFn: organizationApi.getCompanies });
}

export function useCreateCompany() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompanyInput) => organizationApi.createCompany(input),
    onSuccess: () => client.invalidateQueries({ queryKey: companiesKey }),
  });
}

export function useUpdateCompany() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCompanyInput }) =>
      organizationApi.updateCompany(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: companiesKey }),
  });
}

export function useToggleCompanyActive() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { isActive: boolean } }) =>
      organizationApi.updateCompany(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: companiesKey }),
  });
}

export function useBranches(companyId?: string) {
  const scopedCompanyId = companyId ?? '';
  return useQuery({
    queryKey: scopedKey('branches', scopedCompanyId),
    queryFn: () => organizationApi.getBranches(scopedCompanyId),
    enabled: Boolean(scopedCompanyId),
  });
}

export function useCreateBranch() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBranchInput) => organizationApi.createBranch(input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('branches', input.companyId) }),
  });
}

export function useUpdateBranch() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: UpdateBranchInput }) =>
      organizationApi.updateBranch(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('branches', input.companyId) }),
  });
}

export function useToggleBranchActive() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: { isActive: boolean } }) =>
      organizationApi.updateBranch(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('branches', input.companyId) }),
  });
}

export function useDepartments(companyId?: string) {
  const scopedCompanyId = companyId ?? '';
  return useQuery({
    queryKey: scopedKey('departments', scopedCompanyId),
    queryFn: () => organizationApi.getDepartments(scopedCompanyId),
    enabled: Boolean(scopedCompanyId),
  });
}

export function useCreateDepartment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => organizationApi.createDepartment(input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('departments', input.companyId) }),
  });
}

export function useUpdateDepartment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: UpdateDepartmentInput }) =>
      organizationApi.updateDepartment(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('departments', input.companyId) }),
  });
}

export function useToggleDepartmentActive() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: { isActive: boolean } }) =>
      organizationApi.updateDepartment(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('departments', input.companyId) }),
  });
}

export function useCostCenters(companyId?: string) {
  const scopedCompanyId = companyId ?? '';
  return useQuery({
    queryKey: scopedKey('cost-centers', scopedCompanyId),
    queryFn: () => organizationApi.getCostCenters(scopedCompanyId),
    enabled: Boolean(scopedCompanyId),
  });
}

export function useCreateCostCenter() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCostCenterInput) => organizationApi.createCostCenter(input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('cost-centers', input.companyId) }),
  });
}

export function useUpdateCostCenter() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: UpdateCostCenterInput }) =>
      organizationApi.updateCostCenter(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('cost-centers', input.companyId) }),
  });
}

export function useToggleCostCenterActive() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, id, input }: { companyId: string; id: string; input: { isActive: boolean } }) =>
      organizationApi.updateCostCenter(companyId, id, input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: scopedKey('cost-centers', input.companyId) }),
  });
}
