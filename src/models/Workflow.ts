// Workflow Model
export interface Workflow {
  id: string;
  ideaId: string;
  currentStatus: WorkflowStatus;
  assignedTo: string;
  remarks: string;
  decision: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Rerouted';

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
  'Rerouted'
];
