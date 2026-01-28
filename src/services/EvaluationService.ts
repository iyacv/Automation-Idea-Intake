import { EvaluationScore, PriorityLevel, Idea } from '../models';

export class EvaluationService {
  private evaluations: EvaluationScore[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('evaluations');
    if (stored) {
      this.evaluations = JSON.parse(stored).map((e: EvaluationScore) => ({
        ...e,
        evaluatedAt: new Date(e.evaluatedAt)
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('evaluations', JSON.stringify(this.evaluations));
  }

  private generateId(): string {
    return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  evaluateIdea(idea: Idea): EvaluationScore {
    const impact = this.calculateImpact(idea);
    const complexity = this.calculateComplexity(idea);
    const feasibility = this.calculateFeasibility(idea);
    const totalScore = this.calculateTotalScore(impact, complexity, feasibility);
    const priorityLevel = this.determinePriority(totalScore);

    const evaluation: EvaluationScore = {
      id: this.generateId(),
      ideaId: idea.id,
      impact,
      complexity,
      feasibility,
      totalScore,
      priorityLevel,
      evaluatedAt: new Date(),
      evaluatedBy: 'System'
    };

    this.evaluations.push(evaluation);
    this.saveToStorage();
    return evaluation;
  }

  private calculateImpact(idea: Idea): number {
    const benefitScores: Record<string, number> = {
      'Cost Reduction': 10,
      'Time Savings': 9,
      'Quality Improvement': 8,
      'Risk Reduction': 7,
      'Customer Satisfaction': 8,
      'Employee Satisfaction': 6
    };
    return benefitScores[idea.expectedBenefit] || 5;
  }

  private calculateComplexity(idea: Idea): number {
    const descLength = idea.description.length;
    if (descLength > 500) return 8;
    if (descLength > 300) return 6;
    if (descLength > 100) return 4;
    return 3;
  }

  private calculateFeasibility(idea: Idea): number {
    const deptScores: Record<string, number> = {
      'IT': 9,
      'Operations': 8,
      'Finance': 7,
      'HR': 7,
      'Marketing': 6,
      'Sales': 6,
      'Customer Service': 7,
      'Legal': 5
    };
    return deptScores[idea.department] || 5;
  }

  private calculateTotalScore(impact: number, complexity: number, feasibility: number): number {
    return Math.round((impact * 0.4 + (10 - complexity) * 0.3 + feasibility * 0.3) * 10) / 10;
  }

  private determinePriority(totalScore: number): PriorityLevel {
    if (totalScore >= 8) return 'Critical';
    if (totalScore >= 6) return 'High';
    if (totalScore >= 4) return 'Medium';
    return 'Low';
  }

  getEvaluationByIdeaId(ideaId: string): EvaluationScore | undefined {
    return this.evaluations.find(e => e.ideaId === ideaId);
  }

  getStatistics(): Record<PriorityLevel, number> {
    return this.evaluations.reduce((acc, e) => {
      acc[e.priorityLevel] = (acc[e.priorityLevel] || 0) + 1;
      return acc;
    }, {} as Record<PriorityLevel, number>);
  }
}
