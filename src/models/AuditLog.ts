// Audit Log Model
export interface AuditLog {
  id: string;
  ideaId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: Date;
  details: string;
}

export type AuditAction = 
  | 'Created'
  | 'Updated'
  | 'Classified'
  | 'Evaluated'
  | 'StatusChanged'
  | 'Approved'
  | 'Rejected'
  | 'Rerouted';
