// Idea Model
export interface Idea {
  id: string;
  title: string;
  description: string;
  department: Department;
  expectedBenefit: ExpectedBenefit;
  frequency: string;
  submitterName: string;
  dateSubmitted: Date;
  status: IdeaStatus;
}

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
  | 'Risk Reduction'
  | 'Customer Satisfaction'
  | 'Employee Satisfaction';

// Idea Status
export type IdeaStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Rerouted';

export const DEPARTMENTS: Department[] = [
  'IT', 'HR', 'Costing', 'Logistics', 'Planning', 'Purchasing', 'Admin'
];

export const EXPECTED_BENEFITS: ExpectedBenefit[] = [
  'Time Savings', 'Cost Reduction', 'Quality Improvement', 'Customer Satisfaction', 'Employee Satisfaction'
];
