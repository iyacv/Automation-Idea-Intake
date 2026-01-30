interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  ideaId: string;
}

export function SuccessModal({ isOpen, onClose, title, ideaId }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Success Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Idea Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your idea has been successfully submitted and is now under review.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Submitted Idea</p>
            <p className="font-semibold text-gray-800 mb-2">{title}</p>
            <p className="text-xs text-gray-400">Reference ID: {ideaId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
            >
              Submit Another Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
