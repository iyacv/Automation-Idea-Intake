import { Workflow, WorkflowStatus } from '../models';

export class WorkflowService {
  private workflows: Workflow[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('workflows');
    if (stored) {
      this.workflows = JSON.parse(stored).map((w: Workflow) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt)
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('workflows', JSON.stringify(this.workflows));
  }

  private generateId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createWorkflow(ideaId: string): Workflow {
    const workflow: Workflow = {
      id: this.generateId(),
      ideaId,
      currentStatus: 'Submitted',
      assignedTo: 'Pending Assignment',
      remarks: '',
      decision: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflows.push(workflow);
    this.saveToStorage();
    return workflow;
  }

  updateWorkflowStatus(ideaId: string, status: WorkflowStatus, remarks: string): void {
    const workflow = this.workflows.find(w => w.ideaId === ideaId);
    if (workflow) {
      workflow.currentStatus = status;
      workflow.remarks = remarks;
      workflow.decision = status === 'Approved' || status === 'Rejected' ? status : '';
      workflow.updatedAt = new Date();
      this.saveToStorage();
    }
  }

  assignReviewer(ideaId: string, reviewerName: string): void {
    const workflow = this.workflows.find(w => w.ideaId === ideaId);
    if (workflow) {
      workflow.assignedTo = reviewerName;
      workflow.currentStatus = 'Under Review';
      workflow.updatedAt = new Date();
      this.saveToStorage();
    }
  }

  getWorkflowByIdeaId(ideaId: string): Workflow | undefined {
    return this.workflows.find(w => w.ideaId === ideaId);
  }

  getAllWorkflows(): Workflow[] {
    return this.workflows;
  }
}
