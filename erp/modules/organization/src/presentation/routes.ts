import { Hono } from 'hono';
import type { OrganizationService } from '../application/service.js';
import {
  DuplicateCodeError,
  InvalidParentCompanyError,
  OrganizationError,
  OrganizationNotFoundError,
  OrganizationValidationError,
} from '../domain/errors.js';
import {
  createCompanySchema,
  createScopedEntitySchema,
  listQuerySchema,
  updateCompanySchema,
  updateScopedEntitySchema,
} from './validation.js';

export function createOrganizationRouter(service: OrganizationService) {
  const router = new Hono();

  // Helper for error mapping
  function handleError(err: unknown) {
    if (err instanceof OrganizationNotFoundError) {
      return { status: 404 as const, code: err.code, message: err.message };
    }
    if (err instanceof DuplicateCodeError) {
      return { status: 409 as const, code: err.code, message: err.message };
    }
    if (
      err instanceof OrganizationValidationError ||
      err instanceof InvalidParentCompanyError
    ) {
      return { status: 400 as const, code: err.code, message: err.message };
    }
    if (err instanceof OrganizationError) {
      return { status: 400 as const, code: err.code, message: err.message };
    }
    throw err;
  }

  // ---------------------------------------------------------------------------
  // Companies
  // ---------------------------------------------------------------------------

  router.post('/companies', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = createCompanySchema.parse(body);
      const company = await service.createCompany(parsed);
      return c.json({ success: true, data: company }, 201);
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies', async (c) => {
    try {
      const query = listQuerySchema.parse(c.req.query());
      const result = await service.listCompanies(query);
      return c.json({ success: true, data: result });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const company = await service.getCompanyById(id);
      return c.json({ success: true, data: company });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.patch('/companies/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const parsed = updateCompanySchema.parse(body);
      const company = await service.updateCompany(id, parsed);
      return c.json({ success: true, data: company });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  // ---------------------------------------------------------------------------
  // Branches (strictly scoped to Company: /companies/:companyId/branches/:id)
  // ---------------------------------------------------------------------------

  router.post('/companies/:companyId/branches', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const body = await c.req.json();
      const parsed = createScopedEntitySchema.parse(body);
      const branch = await service.createBranch({ ...parsed, companyId });
      return c.json({ success: true, data: branch }, 201);
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/branches', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const query = listQuerySchema.parse(c.req.query());
      const result = await service.listBranches(companyId, query);
      return c.json({ success: true, data: result });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/branches/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const branch = await service.getBranchById(companyId, id);
      return c.json({ success: true, data: branch });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.patch('/companies/:companyId/branches/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const body = await c.req.json();
      const parsed = updateScopedEntitySchema.parse(body);
      const branch = await service.updateBranch(companyId, id, parsed);
      return c.json({ success: true, data: branch });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  // ---------------------------------------------------------------------------
  // Departments (strictly scoped to Company: /companies/:companyId/departments/:id)
  // ---------------------------------------------------------------------------

  router.post('/companies/:companyId/departments', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const body = await c.req.json();
      const parsed = createScopedEntitySchema.parse(body);
      const department = await service.createDepartment({
        ...parsed,
        companyId,
      });
      return c.json({ success: true, data: department }, 201);
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/departments', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const query = listQuerySchema.parse(c.req.query());
      const result = await service.listDepartments(companyId, query);
      return c.json({ success: true, data: result });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/departments/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const department = await service.getDepartmentById(companyId, id);
      return c.json({ success: true, data: department });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.patch('/companies/:companyId/departments/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const body = await c.req.json();
      const parsed = updateScopedEntitySchema.parse(body);
      const department = await service.updateDepartment(companyId, id, parsed);
      return c.json({ success: true, data: department });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  // ---------------------------------------------------------------------------
  // Cost Centers (strictly scoped to Company: /companies/:companyId/cost-centers/:id)
  // ---------------------------------------------------------------------------

  router.post('/companies/:companyId/cost-centers', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const body = await c.req.json();
      const parsed = createScopedEntitySchema.parse(body);
      const costCenter = await service.createCostCenter({
        ...parsed,
        companyId,
      });
      return c.json({ success: true, data: costCenter }, 201);
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/cost-centers', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const query = listQuerySchema.parse(c.req.query());
      const result = await service.listCostCenters(companyId, query);
      return c.json({ success: true, data: result });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.get('/companies/:companyId/cost-centers/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const costCenter = await service.getCostCenterById(companyId, id);
      return c.json({ success: true, data: costCenter });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  router.patch('/companies/:companyId/cost-centers/:id', async (c) => {
    try {
      const companyId = c.req.param('companyId');
      const id = c.req.param('id');
      const body = await c.req.json();
      const parsed = updateScopedEntitySchema.parse(body);
      const costCenter = await service.updateCostCenter(companyId, id, parsed);
      return c.json({ success: true, data: costCenter });
    } catch (err) {
      const mapped = handleError(err);
      return c.json(
        { success: false, error: { code: mapped.code, message: mapped.message } },
        mapped.status,
      );
    }
  });

  return router;
}
