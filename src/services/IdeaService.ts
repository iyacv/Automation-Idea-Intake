import { Idea, IdeaStatus, Department, ExpectedBenefit } from '../models';
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
    expectedBenefit: ExpectedBenefit;
    frequency: string;
    submitterName: string;
  }): Idea {
    const idea: Idea = {
      id: this.generateId(),
      ...data,
      dateSubmitted: new Date(),
      status: 'Submitted'
    };

    this.ideas.push(idea);
    this.saveToStorage();

    this.classificationService.classifyIdea(idea);
    this.evaluationService.evaluateIdea(idea);
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

  updateIdeaStatus(id: string, status: IdeaStatus, remarks: string): void {
    const idea = this.ideas.find(i => i.id === id);
    if (idea) {
      idea.status = status;
      this.saveToStorage();
      this.workflowService.updateWorkflowStatus(id, status, remarks);
      this.auditService.log(id, 'StatusChanged', 'Admin', `Status changed to ${status}: ${remarks}`);
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
      Rerouted: this.getIdeasByStatus('Rerouted').length,
    };

    const byDepartment = this.ideas.reduce((acc, idea) => {
      acc[idea.department] = (acc[idea.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const classificationStats = this.classificationService.getStatistics();
    const evaluationStats = this.evaluationService.getStatistics();

    return {
      total,
      byStatus,
      byDepartment,
      classificationStats,
      evaluationStats
    };
  }
}
