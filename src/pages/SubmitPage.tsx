import { useState } from 'react';
import { Idea } from '../models';
import { IdeaForm, SuccessModal } from '../components';

export function SubmitPage() {
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; idea?: Idea }>({ isOpen: false });

  const handleSubmitSuccess = (idea: Idea) => {
    setSuccessModal({ isOpen: true, idea });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Idea</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Have an idea to improve our processes or automate tasks? Share it with us!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <IdeaForm onSubmitSuccess={handleSubmitSuccess} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Auto Classification</h3>
            <p className="text-sm text-gray-500">Ideas are automatically categorized into Automation, Process Improvement, or Operational Enhancement.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Smart Scoring</h3>
            <p className="text-sm text-gray-500">Each idea is scored on Impact, Complexity, and Feasibility to help prioritize implementation.</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Track Progress</h3>
            <p className="text-sm text-gray-500">Follow your idea through the review process from submission to approval.</p>
          </div>
        </div>
      </div>

      {successModal.idea && (
        <SuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ isOpen: false })} title={successModal.idea.title} ideaId={successModal.idea.id} />
      )}
    </div>
  );
}
