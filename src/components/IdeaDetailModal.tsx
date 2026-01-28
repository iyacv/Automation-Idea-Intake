import { Idea, IdeaStatus } from '../models';

interface IdeaDetailModalProps {
  idea: Idea;
  onClose: () => void;
}

const statusColors: Record<IdeaStatus, string> = {
  'Submitted': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-orange-100 text-orange-700',
  'Approved': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Rerouted': 'bg-purple-100 text-purple-700',
};

export function IdeaDetailModal({ idea, onClose }: IdeaDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">{idea.title}</h2>
              <p className="text-white/80 text-sm">ID: {idea.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[idea.status]}`}>
                {idea.status}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Department</p>
              <p className="font-medium text-gray-800">{idea.department}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitter</p>
              <p className="font-medium text-gray-800">{idea.submitterName}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date Submitted</p>
              <p className="font-medium text-gray-800">{new Date(idea.dateSubmitted).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expected Benefit</p>
              <p className="font-medium text-gray-800">{idea.expectedBenefit}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Frequency</p>
              <p className="font-medium text-gray-800">{idea.frequency}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
