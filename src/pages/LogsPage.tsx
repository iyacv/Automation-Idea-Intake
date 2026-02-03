import { useState, useEffect } from 'react';
import { Idea, IdeaStatus, DEPARTMENTS, COUNTRIES, getPriorityLabel, getPriorityColor, PriorityLabel, PRIORITY_LABELS, User } from '../models';
import { IdeaService } from '../services';
import { AuditService } from '../services/AuditService';
import { AuditLog } from '../models/AuditLog';
import { IdeaDetailModal } from '../components';

interface LogsPageProps {
  user: User | null;
}

export function LogsPage({ user }: LogsPageProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'All'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLabel | 'All'>('All');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdeaForModal, setSelectedIdeaForModal] = useState<Idea | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const ideaService = new IdeaService();
      const auditService = new AuditService();
      const [allIdeas, allLogs] = await Promise.all([
        ideaService.getAllIdeas(),
        auditService.getAllLogs()
      ]);
      setIdeas(allIdeas);
      setAuditLogs(allLogs);
    } finally {
      setIsLoading(false);
    }
  };

  const getLogsForIdea = (ideaId: string) => {
    return auditLogs
      .filter(log => log.ideaId === ideaId)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  };

  const getStatusColor = (status: IdeaStatus) => {
    const colors: Record<IdeaStatus, string> = {
      'Submitted': 'bg-blue-100 text-blue-700',
      'Under Review': 'bg-orange-100 text-orange-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getLogDotColor = (action: string) => {
    const colors: Record<string, string> = {
      'Created': 'bg-green-500',
      'StatusChanged': 'bg-blue-500',
      'Approved': 'bg-emerald-500',
      'Rejected': 'bg-red-500',
      'Updated': 'bg-yellow-500',
      'Classified': 'bg-purple-500',
      'Evaluated': 'bg-orange-500'
    };
    return colors[action] || 'bg-gray-400';
  };

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!idea.title.toLowerCase().includes(query) && 
          !(idea.submitterFirstName + ' ' + idea.submitterLastName).toLowerCase().includes(query) &&
          !idea.id.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Status filter
    if (statusFilter !== 'All' && idea.status !== statusFilter) {
      return false;
    }
    
    // Department filter
    if (departmentFilter !== 'All' && idea.department !== departmentFilter) {
      return false;
    }

    // Country filter
    if (countryFilter !== 'All' && idea.country !== countryFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== 'All' && getPriorityLabel(idea.priority) !== priorityFilter) {
      return false;
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const ideaDate = new Date(idea.dateSubmitted);
      const now = new Date();
      if (dateRange === 'today') {
        if (ideaDate.toDateString() !== now.toDateString()) return false;
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (ideaDate < weekAgo) return false;
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (ideaDate < monthAgo) return false;
      }
    }
    
    return true;
  }).sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500 mt-1">Track all submitted ideas and their status changes</p>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Region</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none"
              >
                <option value="All">All Regions</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as IdeaStatus | 'All')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none"
              >
                <option value="All">All Priority</option>
                {PRIORITY_LABELS.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1"></div>

            {/* Actions */}
            <button className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button 
              onClick={() => {
                const headers = [
                  "ID", "Title", "Description", "Submitter Name", "Submitter Email", 
                  "Department", "Region/Country", "Status", "Priority", 
                  "Date Submitted", "Expected Benefit", "Frequency", 
                  "Current Process Title", "Current Process Problem", "Manual Process?", 
                  "Multi-Dept?", "Involved Depts", "Admin Remarks", "Classification"
                ];

                const csvContent = "\uFEFF" + headers.join(",") + "\n"
                  + filteredIdeas.map(i => [
                      i.id, 
                      `"${i.title.replace(/"/g, '""')}"`, 
                      `"${i.description.replace(/"/g, '""')}"`, 
                      `"${i.submitterFirstName} ${i.submitterLastName}"`,
                      i.submitterEmail,
                      i.department, 
                      i.country,
                      i.status, 
                      (i.status === 'Approved' || i.status === 'Rejected') ? getPriorityLabel(i.priority) : "N/A",
                      i.dateSubmitted.toLocaleString(),
                      `"${i.expectedBenefit}"`,
                      i.frequency,
                      `"${(i.currentProcessTitle || '').replace(/"/g, '""')}"`,
                      `"${(i.currentProcessProblem || '').replace(/"/g, '""')}"`,
                      i.isManualProcess ? "Yes" : "No",
                      i.involvesMultipleDepartments ? "Yes" : "No",
                      `"${(i.involvedDepartments || []).join(", ")}"`,
                      `"${(i.adminRemarks || '').replace(/"/g, '""')}"`,
                      i.classification || "N/A"
                    ].join(",")).join("\n");
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                
                const statusName = statusFilter === 'All' ? 'AllStatus' : statusFilter.replace(/\s+/g, '');
                const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
                const fileName = `${statusName}_IdeaIntakeM88_${dateStr}.csv`;
                
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-600 focus:outline-none w-64"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">Loading activity logs...</p>
            </div>
          ) : (
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Idea ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitter</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No ideas found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredIdeas.map((idea) => (
                  <>
                    <tr 
                      key={idea.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedRow === idea.id ? 'bg-primary-50' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === idea.id ? null : idea.id)}
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(idea.dateSubmitted)}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-500">
                        {idea.id.substring(0, 15)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                        {idea.submitterFirstName} {idea.submitterLastName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {idea.department}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(idea.status)}`}>
                          {idea.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {(idea.status === 'Approved' || idea.status === 'Rejected') ? (
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(getPriorityLabel(idea.priority))}`}>
                            {getPriorityLabel(idea.priority)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {idea.title}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === idea.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {expandedRow === idea.id && (
                      <tr key={`${idea.id}-expanded`}>
                        <td colSpan={7} className="bg-gray-50 border-l-4 border-primary-500 px-6 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Idea Details */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-semibold text-primary-700">IDEA DETAILS</h4>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedIdeaForModal(idea); }}
                                  className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                                >
                                  More <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="mb-2">
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Title</p>
                                  <p className="text-gray-800 font-medium leading-tight">{idea.title}</p>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Expected Benefit</span>
                                  <span className="text-gray-800">{idea.expectedBenefit}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Frequency</span>
                                  <span className="text-gray-800">{idea.frequency}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Manual Process</span>
                                  <span className="text-gray-800">{idea.isManualProcess ? 'Yes' : 'No'}</span>
                                </div>
                                {idea.classification && (idea.status === 'Approved' || idea.status === 'Rejected') && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Classification</span>
                                    <span className="text-gray-800">{idea.classification}</span>
                                  </div>
                                )}
                                {idea.priority && (idea.status === 'Approved' || idea.status === 'Rejected') && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Priority</span>
                                    <span className="text-gray-800">{idea.priority}/10 ({getPriorityLabel(idea.priority)})</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Activity Log */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-semibold text-primary-700 mb-3">LOG</h4>
                              <div className="space-y-3">
                                {getLogsForIdea(idea.id).map((log, index) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${getLogDotColor(log.action)}`}></div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-800">{log.details}</p>
                                      <p className="text-xs text-gray-400">{formatDate(log.performedAt)}</p>
                                    </div>
                                  </div>
                                ))}
                                {getLogsForIdea(idea.id).length === 0 && (
                                  <p className="text-sm text-gray-400">No activity logs</p>
                                )}
                              </div>
                            </div>

                            {/* Admin Review */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-semibold text-primary-700 mb-3">REVIEW INFORMATION</h4>
                              <div className="space-y-3">
                                {idea.adminRemarks ? (
                                  <>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Admin Remarks</p>
                                      <p className="text-sm text-gray-800">{idea.adminRemarks}</p>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-400">No review information yet</p>
                                )}
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 mb-1">Status</p>
                                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(idea.status)}`}>
                                    {idea.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredIdeas.length} of {ideas.length} ideas
        </div>
      </div>

      {selectedIdeaForModal && (
        <IdeaDetailModal 
          idea={selectedIdeaForModal} 
          onClose={() => setSelectedIdeaForModal(null)} 
          onUpdateStatus={async (idea, status, reviewData) => {
            const ideaService = new IdeaService();
            await ideaService.updateIdeaStatus(idea.id, status, reviewData, user?.name || 'Admin');
            loadData();
            setSelectedIdeaForModal(null);
          }}
        />
      )}
    </div>
  );
}
