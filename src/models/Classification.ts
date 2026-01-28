// Classification Model
export interface Classification {
  id: string;
  ideaId: string;
  category: ClassificationCategory;
  classifiedAt: Date;
  classifiedBy: string;
}

export type ClassificationCategory = 
  | 'Automation'
  | 'Process Improvement'
  | 'Operational Enhancement';

export const CATEGORIES: ClassificationCategory[] = [
  'Automation',
  'Process Improvement', 
  'Operational Enhancement'
];
