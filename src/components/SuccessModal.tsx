
import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  ideaId: string;
  submitterEmail?: string;
}

export function SuccessModal({ isOpen, onClose, title, ideaId, submitterEmail }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ideaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
        {/* Success header with gradient */}
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 px-6 pt-8 pb-10 text-center relative">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white">Idea Submitted!</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-5">
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-800">Thank you for your submission!</p>
              <p className="text-xs text-gray-500 mt-1">
                A confirmation email has been sent to <span className="text-primary-600 font-semibold">{submitterEmail || 'your email'}</span>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1.5">REFERENCE ID</p>
              <div className="flex items-center justify-between gap-2 mb-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-gray-900">{ideaId}</span>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Copy ID
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1.5">IDEA TITLE</p>
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md active:scale-[0.98]"
          >
            Submit Another Idea
          </button>
        </div>
      </div>
    </div>
  );
}
