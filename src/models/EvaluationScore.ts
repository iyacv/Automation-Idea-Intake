// Evaluation Score Model
export interface EvaluationScore {
  id: string;
  ideaId: string;
  impact: number;
  complexity: number;
  feasibility: number;
  totalScore: number;
  priorityLevel: PriorityLevel;
  evaluatedAt: Date;
  evaluatedBy: string;
}

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export const PRIORITY_LEVELS: PriorityLevel[] = ['Critical', 'High', 'Medium', 'Low'];
