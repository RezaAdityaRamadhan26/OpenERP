/**
 * Domain entity types for Organization module.
 * No external dependencies allowed in domain layer.
 */

export interface Company {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostCenter {
  id: string;
  companyId: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
