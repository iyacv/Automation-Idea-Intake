import { Idea, IdeaStatus, Department, ExpectedBenefit, Country } from '../models';
import { ClassificationService } from './ClassificationService';
import { EvaluationService } from './EvaluationService';
import { WorkflowService } from './WorkflowService';
import { AuditService } from './AuditService';

export class IdeaService {
  private ideas: Idea[] = [];
  private classificationService: ClassificationService;
  private evaluationService: EvaluationService;
  private workflowService: WorkflowService;
  private auditService: AuditService;

  constructor() {
    this.classificationService = new ClassificationService();
    this.evaluationService = new EvaluationService();
    this.workflowService = new WorkflowService();
    this.auditService = new AuditService();
    this.loadFromStorage();
  }

  private generateId(): string {
    return `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('ideas');
    if (stored) {
      this.ideas = JSON.parse(stored).map((idea: Idea) => ({
        ...idea,
        dateSubmitted: new Date(idea.dateSubmitted)
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('ideas', JSON.stringify(this.ideas));
  }

  submitIdea(data: {
    title: string;
    description: string;
    department: Department;
    country: Country;
    expectedBenefit: ExpectedBenefit;
    frequency: string;
    submitterName: string;
    currentProcessTitle?: string;
    currentProcessProblem?: string;
    isManualProcess?: boolean;
    involvesMultipleDepartments?: boolean;
    involvedDepartments?: Department[];
  }): Idea {
    const idea: Idea = {
      id: this.generateId(),
      ...data,
      dateSubmitted: new Date(),
      status: 'Submitted'
    };

    this.ideas.push(idea);
    this.saveToStorage();

    this.workflowService.createWorkflow(idea.id);
    this.auditService.log(idea.id, 'Created', 'System', 'Idea submitted');

    return idea;
  }

  getAllIdeas(): Idea[] {
    return this.ideas;
  }

  getIdeaById(id: string): Idea | undefined {
    return this.ideas.find(idea => idea.id === id);
  }

  updateIdeaStatus(
    id: string, 
    status: IdeaStatus, 
    reviewData: {
      classification?: string;
      priority?: number;
      remarks?: string;
    }
  ): void {
    const idea = this.ideas.find(i => i.id === id);
    if (idea) {
      idea.status = status;
      if (reviewData.classification) {
        idea.classification = reviewData.classification as any;
      }
      if (reviewData.priority !== undefined) {
        idea.priority = reviewData.priority;
      }
      if (reviewData.remarks) {
        idea.adminRemarks = reviewData.remarks;
      }
      this.saveToStorage();
      this.workflowService.updateWorkflowStatus(id, status, reviewData.remarks || '');
      this.auditService.log(id, 'StatusChanged', 'Admin', `Status changed to ${status}${reviewData.remarks ? ': ' + reviewData.remarks : ''}`);
    }
  }

  getIdeasByStatus(status: IdeaStatus): Idea[] {
    return this.ideas.filter(idea => idea.status === status);
  }

  getIdeasByDepartment(department: Department): Idea[] {
    return this.ideas.filter(idea => idea.department === department);
  }

  getStatistics() {
    const total = this.ideas.length;
    const byStatus = {
      Submitted: this.getIdeasByStatus('Submitted').length,
      'Under Review': this.getIdeasByStatus('Under Review').length,
      Approved: this.getIdeasByStatus('Approved').length,
      Rejected: this.getIdeasByStatus('Rejected').length,
    };

    const byDepartment = this.ideas.reduce((acc, idea) => {
      acc[idea.department] = (acc[idea.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate classification stats from ideas directly
    const classificationStats: Record<string, number> = {
      'Automation': 0,
      'Process Improvement': 0,
      'Operational Enhancement': 0
    };
    this.ideas.forEach(idea => {
      if (idea.classification) {
        classificationStats[idea.classification] = (classificationStats[idea.classification] || 0) + 1;
      }
    });

    // Calculate priority/evaluation stats from ideas directly
    const evaluationStats: Record<string, number> = {
      'Critical': 0,
      'High': 0,
      'Medium': 0,
      'Low': 0
    };
    this.ideas.forEach(idea => {
      if (idea.priority !== undefined) {
        if (idea.priority >= 9) evaluationStats['Critical']++;
        else if (idea.priority >= 7) evaluationStats['High']++;
        else if (idea.priority >= 4) evaluationStats['Medium']++;
        else evaluationStats['Low']++;
      }
    });

    return {
      total,
      byStatus,
      byDepartment,
      classificationStats,
      evaluationStats
    };
  }
}
