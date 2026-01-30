import { useState } from 'react';
import { Idea } from '../models';
import { IdeaForm, SuccessModal } from '../components';

export function SubmitPage() {
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; idea?: Idea }>({ isOpen: false });
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmitSuccess = (idea: Idea) => {
    setSuccessModal({ isOpen: true, idea });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Submit Your Automation Idea</h1>
          <p className="text-gray-500 mt-2">Share your idea to help improve our processes</p>
        </div>

        {/* Step Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentStep(1)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentStep === 1
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              1. Idea Details
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentStep === 2
                  ? 'border-primary-700 text-primary-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              2. Review
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
          <IdeaForm onSubmitSuccess={handleSubmitSuccess} />
        </div>

        {/* Required field note */}
        <p className="text-xs text-gray-400 mt-4">* Required fields</p>
      </div>

      {successModal.idea && (
        <SuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ isOpen: false })} title={successModal.idea.title} ideaId={successModal.idea.id} />
      )}
    </div>
  );
}
