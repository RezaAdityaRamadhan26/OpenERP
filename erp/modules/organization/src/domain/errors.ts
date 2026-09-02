/**
 * Domain error definitions for Organization module.
 * Preserves stable machine-readable codes.
 */

export class OrganizationError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'OrganizationError';
    this.code = code;
  }
}

export class OrganizationNotFoundError extends OrganizationError {
  constructor(entityType: string, identifier: string) {
    super(`${entityType} not found for identifier: ${identifier}`, 'ORGANIZATION_NOT_FOUND');
    this.name = 'OrganizationNotFoundError';
  }
}

export class DuplicateCodeError extends OrganizationError {
  constructor(entityType: string, code: string, companyId?: string) {
    const scopeMsg = companyId ? ` in company ${companyId}` : '';
    super(`${entityType} with code '${code}' already exists${scopeMsg}`, 'DUPLICATE_CODE');
    this.name = 'DuplicateCodeError';
  }
}

export class OrganizationValidationError extends OrganizationError {
  constructor(message: string) {
    super(message, 'ORGANIZATION_VALIDATION_ERROR');
    this.name = 'OrganizationValidationError';
  }
}

export class InvalidParentCompanyError extends OrganizationError {
  constructor(companyId: string) {
    super(`Parent company '${companyId}' does not exist or is inactive`, 'INVALID_PARENT_COMPANY');
    this.name = 'InvalidParentCompanyError';
  }
}

export class OrganizationPersistenceError extends OrganizationError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'OrganizationPersistenceError';
  }
}
