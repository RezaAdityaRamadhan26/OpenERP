import React, { useState } from 'react';
import {
  useBranches,
  useCompanies,
  useCreateDepartment,
  useDepartments,
  useToggleDepartmentActive,
  useUpdateDepartment,
} from './hooks.js';
import type { Department } from './types.js';
import { type DepartmentFormData, departmentSchema } from './validation.js';

export function DepartmentsPage() {
  const { data: companies } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const effectiveCompanyId = selectedCompanyId || (companies && companies[0]?.id) || '';

  const {
    data: departments,
    isLoading,
    error,
    refetch,
  } = useDepartments(effectiveCompanyId || undefined);
  const { data: branches } = useBranches(effectiveCompanyId || undefined);

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const toggleActiveMutation = useToggleDepartmentActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({
    company_id: '',
    branch_id: '',
    parent_id: '',
    code: '',
    name: '',
    is_active: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingDepartment(null);
    setFormData({
      company_id: effectiveCompanyId,
      branch_id: '',
      parent_id: '',
      code: '',
      name: '',
      is_active: true,
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      company_id: dept.company_id,
      branch_id: dept.branch_id || '',
      parent_id: dept.parent_id || '',
      code: dept.code,
      name: dept.name,
      is_active: dept.is_active,
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const parseResult = departmentSchema.safeParse(formData);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path[0] as string;
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      if (editingDepartment) {
        await updateMutation.mutateAsync({
          id: editingDepartment.id,
          input: {
            company_id: parseResult.data.company_id,
            branch_id: parseResult.data.branch_id || null,
            parent_id: parseResult.data.parent_id || null,
            name: parseResult.data.name,
            is_active: parseResult.data.is_active,
          },
        });
        setActionSuccess(`Department "${parseResult.data.name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync({
          company_id: parseResult.data.company_id,
          branch_id: parseResult.data.branch_id || null,
          parent_id: parseResult.data.parent_id || null,
          code: parseResult.data.code,
          name: parseResult.data.name,
          is_active: parseResult.data.is_active,
        });
        setActionSuccess(`Department "${parseResult.data.name}" created successfully.`);
      }
      closeModal();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleToggleActive = async (dept: Department) => {
    try {
      await toggleActiveMutation.mutateAsync({
        id: dept.id,
        is_active: !dept.is_active,
      });
      setActionSuccess(`Department "${dept.name}" ${dept.is_active ? 'deactivated' : 'activated'}.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Toggle active state failed');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Departments</h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize functional units, divisions, and reporting structure.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          disabled={!companies || companies.length === 0}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors disabled:opacity-50"
        >
          Add Department
        </button>
      </div>

      {/* Company Scope Selector */}
      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
        <label htmlFor="dept-scope-company" className="text-xs font-semibold text-slate-700 uppercase">
          Company Scope:
        </label>
        <select
          id="dept-scope-company"
          value={effectiveCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="text-sm border border-slate-300 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
        >
          {companies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.code})
            </option>
          ))}
          {(!companies || companies.length === 0) && (
            <option value="">No companies available</option>
          )}
        </select>
      </div>

      {/* Success banner */}
      {actionSuccess && (
        <div className="p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
          {actionSuccess}
        </div>
      )}

      {/* Content Table / States */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {isLoading && (
          <div className="p-8 text-center text-sm text-slate-500 animate-pulse">
            Loading departments...
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              Failed to load departments: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (!departments || departments.length === 0) && (
          <div className="p-12 text-center">
            <h3 className="text-sm font-medium text-slate-900">No departments found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {companies && companies.length > 0
                ? 'Create a department under this company.'
                : 'Please create a company first.'}
            </p>
            {companies && companies.length > 0 && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md"
              >
                Add Department
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && departments && departments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Parent Dept</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((d) => {
                  const branch = branches?.find((b) => b.id === d.branch_id);
                  const parent = departments?.find((p) => p.id === d.parent_id);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-900">{d.code}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{d.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {branch ? branch.name : <span className="text-slate-400">All / Central</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {parent ? parent.name : <span className="text-slate-400">None</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            d.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {d.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(d)}
                          className="text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(d)}
                          disabled={toggleActiveMutation.isPending}
                          className="text-xs font-medium text-slate-500 hover:text-slate-700 underline disabled:opacity-50"
                        >
                          {d.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                {editingDepartment ? `Edit Department: ${editingDepartment.code}` : 'Create New Department'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {generalError && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
                  {generalError}
                </div>
              )}

              <div>
                <label htmlFor="dept-form-company" className="block text-xs font-medium text-slate-700 mb-1">
                  Company *
                </label>
                <select
                  id="dept-form-company"
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  disabled={Boolean(editingDepartment)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                >
                  {companies?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {fieldErrors.company_id && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.company_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dept-form-branch" className="block text-xs font-medium text-slate-700 mb-1">
                    Branch (Optional)
                  </label>
                  <select
                    id="dept-form-branch"
                    value={formData.branch_id || ''}
                    onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">(All Branches / Central)</option>
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dept-form-parent" className="block text-xs font-medium text-slate-700 mb-1">
                    Parent Department
                  </label>
                  <select
                    id="dept-form-parent"
                    value={formData.parent_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">(Top-level Department)</option>
                    {departments
                      ?.filter((d) => !editingDepartment || d.id !== editingDepartment.id)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dept-form-code" className="block text-xs font-medium text-slate-700 mb-1">
                  Department Code *
                </label>
                <input
                  id="dept-form-code"
                  type="text"
                  disabled={Boolean(editingDepartment)}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                  placeholder="e.g. FIN-ACC"
                />
                {fieldErrors.code && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.code}</p>
                )}
              </div>

              <div>
                <label htmlFor="dept-form-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Department Name *
                </label>
                <input
                  id="dept-form-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="e.g. Finance & Accounting"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dept_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="dept_active" className="text-xs text-slate-700">
                  Active department status
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingDepartment ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
