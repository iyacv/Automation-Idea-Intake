import { useState } from 'react';
import { Idea, DEPARTMENTS, EXPECTED_BENEFITS, Department, ExpectedBenefit } from '../models';
import { IdeaService } from '../services';

interface IdeaFormProps {
  onSubmitSuccess: (idea: Idea) => void;
}

export function IdeaForm({ onSubmitSuccess }: IdeaFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '' as Department | '',
    expectedBenefit: '' as ExpectedBenefit | '',
    frequency: '',
    submitterName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.expectedBenefit) newErrors.expectedBenefit = 'Expected benefit is required';
    if (!formData.frequency.trim()) newErrors.frequency = 'Frequency is required';
    if (!formData.submitterName.trim()) newErrors.submitterName = 'Your name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const ideaService = new IdeaService();
      const idea = ideaService.submitIdea({
        title: formData.title,
        description: formData.description,
        department: formData.department as Department,
        expectedBenefit: formData.expectedBenefit as ExpectedBenefit,
        frequency: formData.frequency,
        submitterName: formData.submitterName
      });
      setFormData({ title: '', description: '', department: '', expectedBenefit: '', frequency: '', submitterName: '' });
      onSubmitSuccess(idea);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) => `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none ${errors[field] ? 'border-accent-red bg-red-50' : 'border-gray-200 bg-white focus:border-primary-500'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Idea Title <span className="text-red-500">*</span></label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter a descriptive title" className={inputClass('title')} />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your idea in detail" rows={5} className={inputClass('description')} />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department <span className="text-red-500">*</span></label>
          <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })} className={inputClass('department')}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((dept: Department) => <option key={dept} value={dept}>{dept}</option>)}
          </select>
          {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Benefit <span className="text-red-500">*</span></label>
          <select value={formData.expectedBenefit} onChange={(e) => setFormData({ ...formData, expectedBenefit: e.target.value as ExpectedBenefit })} className={inputClass('expectedBenefit')}>
            <option value="">Select expected benefit</option>
            {EXPECTED_BENEFITS.map((benefit: ExpectedBenefit) => <option key={benefit} value={benefit}>{benefit}</option>)}
          </select>
          {errors.expectedBenefit && <p className="mt-1 text-sm text-red-500">{errors.expectedBenefit}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frequency <span className="text-red-500">*</span></label>
          <input type="text" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} placeholder="e.g., Daily, Weekly" className={inputClass('frequency')} />
          {errors.frequency && <p className="mt-1 text-sm text-red-500">{errors.frequency}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name <span className="text-red-500">*</span></label>
          <input type="text" value={formData.submitterName} onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })} placeholder="Enter your full name" className={inputClass('submitterName')} />
          {errors.submitterName && <p className="mt-1 text-sm text-red-500">{errors.submitterName}</p>}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50">
        {isSubmitting ? 'Submitting...' : 'Submit Idea'}
      </button>
    </form>
  );
}
