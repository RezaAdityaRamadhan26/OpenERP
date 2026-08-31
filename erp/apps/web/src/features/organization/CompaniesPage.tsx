import React, { useState } from 'react';
import {
  useCompanies,
  useCreateCompany,
  useToggleCompanyActive,
  useUpdateCompany,
} from './hooks.js';
import type { Company } from './types.js';
import { type CompanyFormData, companySchema } from './validation.js';

export function CompaniesPage() {
  const { data: companies, isLoading, error, refetch } = useCompanies();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const toggleActiveMutation = useToggleCompanyActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    code: '',
    name: '',
    legal_name: '',
    tax_id: '',
    currency: 'USD',
    timezone: 'UTC',
    fiscal_year_start_month: 1,
    is_active: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      code: '',
      name: '',
      legal_name: '',
      tax_id: '',
      currency: 'USD',
      timezone: 'UTC',
      fiscal_year_start_month: 1,
      is_active: true,
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      code: company.code,
      name: company.name,
      legal_name: company.legal_name || '',
      tax_id: company.tax_id || '',
      currency: company.currency,
      timezone: company.timezone,
      fiscal_year_start_month: company.fiscal_year_start_month,
      is_active: company.is_active,
    });
    setFieldErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const parseResult = companySchema.safeParse(formData);
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
      if (editingCompany) {
        await updateMutation.mutateAsync({
          id: editingCompany.id,
          input: {
            name: parseResult.data.name,
            legal_name: parseResult.data.legal_name || null,
            tax_id: parseResult.data.tax_id || null,
            currency: parseResult.data.currency,
            timezone: parseResult.data.timezone,
            fiscal_year_start_month: parseResult.data.fiscal_year_start_month,
            is_active: parseResult.data.is_active,
          },
        });
        setActionSuccess(`Company "${parseResult.data.name}" updated successfully.`);
      } else {
        await createMutation.mutateAsync({
          code: parseResult.data.code,
          name: parseResult.data.name,
          legal_name: parseResult.data.legal_name || null,
          tax_id: parseResult.data.tax_id || null,
          currency: parseResult.data.currency,
          timezone: parseResult.data.timezone,
          fiscal_year_start_month: parseResult.data.fiscal_year_start_month,
          is_active: parseResult.data.is_active,
        });
        setActionSuccess(`Company "${parseResult.data.name}" created successfully.`);
      }
      closeModal();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleToggleActive = async (company: Company) => {
    try {
      await toggleActiveMutation.mutateAsync({
        id: company.id,
        is_active: !company.is_active,
      });
      setActionSuccess(
        `Company "${company.name}" ${company.is_active ? 'deactivated' : 'activated'}.`,
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
          <h2 className="text-xl font-semibold text-slate-900">Companies</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage legal entities and foundational company profiles.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors"
        >
          Add Company
        </button>
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
            Loading companies...
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              Failed to load companies: {error instanceof Error ? error.message : 'Unknown error'}
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

        {!isLoading && !error && companies?.length === 0 && (
          <div className="p-12 text-center">
            <h3 className="text-sm font-medium text-slate-900">No companies found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Get started by creating the first legal entity.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md"
            >
              Add Company
            </button>
          </div>
        )}

        {!isLoading && !error && companies && companies.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Timezone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">{c.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{c.name}</div>
                      {c.legal_name && (
                        <div className="text-xs text-slate-400">{c.legal_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.currency}</td>
                    <td className="px-4 py-3 text-slate-600">{c.timezone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          c.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        disabled={toggleActiveMutation.isPending}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 underline disabled:opacity-50"
                      >
                        {c.is_active ? 'Deactivate' : 'Activate'}
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
                {editingCompany ? `Edit Company: ${editingCompany.code}` : 'Create New Company'}
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
                <label htmlFor="company-code" className="block text-xs font-medium text-slate-700 mb-1">
                  Code *
                </label>
                <input
                  id="company-code"
                  type="text"
                  disabled={Boolean(editingCompany)}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
                  placeholder="e.g. ACME-HQ"
                />
                {fieldErrors.code && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.code}</p>
                )}
              </div>

              <div>
                <label htmlFor="company-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="e.g. Acme Corporation"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="company-legal-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Legal Name
                  </label>
                  <input
                    id="company-legal-name"
                    type="text"
                    value={formData.legal_name || ''}
                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="e.g. PT Acme Indonesia"
                  />
                  {fieldErrors.legal_name && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.legal_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-tax-id" className="block text-xs font-medium text-slate-700 mb-1">
                    Tax ID
                  </label>
                  <input
                    id="company-tax-id"
                    type="text"
                    value={formData.tax_id || ''}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="e.g. 01.234.567.8-901.000"
                  />
                  {fieldErrors.tax_id && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.tax_id}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="company-currency" className="block text-xs font-medium text-slate-700 mb-1">
                    Currency *
                  </label>
                  <input
                    id="company-currency"
                    type="text"
                    maxLength={3}
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    placeholder="USD"
                  />
                  {fieldErrors.currency && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.currency}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-timezone" className="block text-xs font-medium text-slate-700 mb-1">
                    Timezone *
                  </label>
                  <input
                    id="company-timezone"
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="UTC or Asia/Jakarta"
                  />
                  {fieldErrors.timezone && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.timezone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-fiscal-month" className="block text-xs font-medium text-slate-700 mb-1">
                    Fiscal Start Month
                  </label>
                  <input
                    id="company-fiscal-month"
                    type="number"
                    min={1}
                    max={12}
                    value={formData.fiscal_year_start_month}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fiscal_year_start_month: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {fieldErrors.fiscal_year_start_month && (
                    <p className="text-xs text-red-600 mt-1">
                      {fieldErrors.fiscal_year_start_month}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="company_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="company_active" className="text-xs text-slate-700">
                  Active company status
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
                  {editingCompany ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
