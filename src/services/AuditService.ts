import { supabase } from '../lib/supabase';
import { AuditLog, AuditAction } from '../models';

export class AuditService {
  async log(ideaId: string, action: AuditAction, performedBy: string, details: string): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        idea_id: ideaId,
        action,
        performed_by: performedBy,
        details
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating audit log:', error);
      return null;
    }

    return this.mapToLog(data);
  }

  async getLogsByIdeaId(ideaId: string): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('idea_id', ideaId)
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return data.map(item => this.mapToLog(item));
  }

  async getAllLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching all logs:', error);
      return [];
    }

    return data.map(item => this.mapToLog(item));
  }

  private mapToLog(item: any): AuditLog {
    return {
      id: item.id,
      ideaId: item.idea_id,
      action: item.action as AuditAction,
      performedBy: item.performed_by,
      performedAt: new Date(item.performed_at),
      details: item.details
    };
  }
}
