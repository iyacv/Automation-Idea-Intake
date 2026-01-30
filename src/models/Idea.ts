import { ClassificationCategory } from './Classification';

// Idea Model
export interface Idea {
  id: string;
  title: string;
  description: string;
  department: Department;
  country: Country;
  expectedBenefit: ExpectedBenefit;
  frequency: string;
  submitterName: string;
  dateSubmitted: Date;
  status: IdeaStatus;
  // Current process fields
  currentProcessTitle?: string;
  currentProcessProblem?: string;
  isManualProcess?: boolean;
  involvesMultipleDepartments?: boolean;
  involvedDepartments?: Department[];
  // Admin review fields
  classification?: ClassificationCategory;
  priority?: number; // 1-10 scale
  adminRemarks?: string;
}

// Country
export type Country = 'Philippines' | 'US' | 'Indonesia';

// Department 
export type Department = 
  | 'IT'
  | 'HR'
  | 'Costing'
  | 'Logistics'
  | 'Planning'
  | 'Purchasing'
  | 'Admin'
;

// Expected Benefit 
export type ExpectedBenefit =
  | 'Time Savings'
  | 'Cost Reduction'
  | 'Quality Improvement'
  | 'Customer Satisfaction'
  | 'Employee Satisfaction';

// Idea Status (removed Rerouted)
export type IdeaStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export const COUNTRIES: Country[] = ['Philippines', 'US', 'Indonesia'];

export const DEPARTMENTS: Department[] = [
  'IT', 'HR', 'Costing', 'Logistics', 'Planning', 'Purchasing', 'Admin'
];

export const EXPECTED_BENEFITS: ExpectedBenefit[] = [
  'Time Savings', 'Cost Reduction', 'Quality Improvement', 'Customer Satisfaction', 'Employee Satisfaction'
];
