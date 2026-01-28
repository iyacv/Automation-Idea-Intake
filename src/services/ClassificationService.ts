import { Classification, ClassificationCategory, Idea } from '../models';

export class ClassificationService {
  private classifications: Classification[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('classifications');
    if (stored) {
      this.classifications = JSON.parse(stored).map((c: Classification) => ({
        ...c,
        classifiedAt: new Date(c.classifiedAt)
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('classifications', JSON.stringify(this.classifications));
  }

  private generateId(): string {
    return `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  classifyIdea(idea: Idea): Classification {
    const category = this.determineCategory(idea);
    
    const classification: Classification = {
      id: this.generateId(),
      ideaId: idea.id,
      category,
      classifiedAt: new Date(),
      classifiedBy: 'System'
    };

    this.classifications.push(classification);
    this.saveToStorage();
    return classification;
  }

  private determineCategory(idea: Idea): ClassificationCategory {
    const text = `${idea.title} ${idea.description}`.toLowerCase();
    
    const automationKeywords = ['automate', 'automation', 'bot', 'rpa', 'script', 'automatic', 'workflow automation'];
    if (automationKeywords.some(kw => text.includes(kw))) {
      return 'Automation';
    }
    
    const processKeywords = ['process', 'streamline', 'simplify', 'reduce steps', 'efficiency', 'optimize'];
    if (processKeywords.some(kw => text.includes(kw))) {
      return 'Process Improvement';
    }
    
    return 'Operational Enhancement';
  }

  getClassificationByIdeaId(ideaId: string): Classification | undefined {
    return this.classifications.find(c => c.ideaId === ideaId);
  }

  getStatistics(): Record<ClassificationCategory, number> {
    return this.classifications.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<ClassificationCategory, number>);
  }
}
