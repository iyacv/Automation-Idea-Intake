import { AuditLog, AuditAction } from '../models';

export class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('auditLogs');
    if (stored) {
      this.logs = JSON.parse(stored).map((log: AuditLog) => ({
        ...log,
        performedAt: new Date(log.performedAt)
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('auditLogs', JSON.stringify(this.logs));
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  log(ideaId: string, action: AuditAction, performedBy: string, details: string): AuditLog {
    const auditLog: AuditLog = {
      id: this.generateId(),
      ideaId,
      action,
      performedBy,
      performedAt: new Date(),
      details
    };

    this.logs.push(auditLog);
    this.saveToStorage();
    return auditLog;
  }

  getLogsByIdeaId(ideaId: string): AuditLog[] {
    return this.logs.filter(log => log.ideaId === ideaId);
  }

  getAllLogs(): AuditLog[] {
    return this.logs.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
  }
}
