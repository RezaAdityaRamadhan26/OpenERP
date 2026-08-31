import type React from 'react';
import { useState } from 'react';
import {
  useBranches,
  useCompanies,
  useCreateBranch,
  useToggleBranchActive,
  useUpdateBranch,
} from './hooks.js';
import type { Branch } from './types.js';
import { type ScopedEntityFormData, scopedEntitySchema } from './validation.js';

export function BranchesPage() {
  const { data: companies } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const effectiveCompanyId = selectedCompanyId || companies?.[0]?.id || '';

  const {
    data: branches,
    isLoading,
    error,
    refetch,
  } = useBranches(effectiveCompanyId || undefined);

  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const toggleActiveMutation = useToggleBranchActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<ScopedEntityFormData>({
    code: '',
    name: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingBranch(null);
    setFormData({
      code: '',
      name: '',
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      code: branch.code,
      name: branch.name,
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const parseResult = scopedEntitySchema.safeParse(formData);
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
      if (editingBranch) {
        await updateMutation.mutateAsync({
          companyId: effectiveCompanyId,
          id: editingBranch.id,
          input: {
            name: parseResult.data.name,
          },
        });
        setActionSuccess(`Branch "${parseResult.data.name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync({
          companyId: effectiveCompanyId,
          code: parseResult.data.code,
          name: parseResult.data.name,
        });
        setActionSuccess(`Branch "${parseResult.data.name}" created successfully.`);
      }
      closeModal();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      await toggleActiveMutation.mutateAsync({
        companyId: effectiveCompanyId,
        id: branch.id,
        input: { isActive: !branch.isActive }
      });
      setActionSuccess(
        `Branch "${branch.name}" ${branch.isActive ? 'deactivated' : 'activated'}.`,
      );
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
          <h2 className="text-xl font-semibold text-slate-900">Branches</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage physical sites, offices, and operational branches.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          disabled={!companies || companies.length === 0}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors disabled:opacity-50"
        >
          Add Branch
        </button>
      </div>

      {/* Company Scope Selector */}
      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
        <label htmlFor="branch-scope-company" className="text-xs font-semibold text-slate-700 uppercase">
          Company Scope:
        </label>
        <select
          id="branch-scope-company"
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
            Loading branches...
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              Failed to load branches: {error instanceof Error ? error.message : 'Unknown error'}
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

        {!isLoading && !error && (!branches || branches.length === 0) && (
          <div className="p-12 text-center">
            <h3 className="text-sm font-medium text-slate-900">No branches found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {companies && companies.length > 0
                ? 'Create a branch under this company.'
                : 'Please create a company first.'}
            </p>
            {companies && companies.length > 0 && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md"
              >
                Add Branch
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && branches && branches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">{b.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{b.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          b.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {b.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        className="text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(b)}
                        disabled={toggleActiveMutation.isPending}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 underline disabled:opacity-50"
                      >
                        {b.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
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
                {editingBranch ? `Edit Branch: ${editingBranch.code}` : 'Create New Branch'}
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
                <label htmlFor="branch-form-code" className="block text-xs font-medium text-slate-700 mb-1">
                  Branch Code *
                </label>
                <input
                  id="branch-form-code"
                  type="text"
                  disabled={Boolean(editingBranch)}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                  placeholder="e.g. BR-JKT-01"
                />
                {fieldErrors.code && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.code}</p>
                )}
              </div>

              <div>
                <label htmlFor="branch-form-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Branch Name *
                </label>
                <input
                  id="branch-form-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="e.g. Jakarta Main Branch"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                )}
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
                  {editingBranch ? 'Save Changes' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
