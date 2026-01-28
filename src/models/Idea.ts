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

// Department enum
export type Department = 
  | 'IT'
  | 'HR'
  | 'Finance'
  | 'Operations'
  | 'Marketing'
  | 'Sales'
  | 'Customer Service'
  | 'Legal';

// Expected Benefit enum
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
  'IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales', 'Customer Service', 'Legal'
];

export const EXPECTED_BENEFITS: ExpectedBenefit[] = [
  'Time Savings', 'Cost Reduction', 'Quality Improvement', 'Risk Reduction', 'Customer Satisfaction', 'Employee Satisfaction'
];
