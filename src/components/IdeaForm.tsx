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
    submitterName: '',
    // New current process fields
    currentProcessTitle: '',
    currentProcessProblem: '',
    isManualProcess: false,
    involvesMultipleDepartments: false,
    involvedDepartments: [] as Department[]
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
        submitterName: formData.submitterName,
        currentProcessTitle: formData.currentProcessTitle,
        currentProcessProblem: formData.currentProcessProblem,
        isManualProcess: formData.isManualProcess,
        involvesMultipleDepartments: formData.involvesMultipleDepartments,
        involvedDepartments: formData.involvesMultipleDepartments ? formData.involvedDepartments : undefined
      });
      setFormData({ 
        title: '', 
        description: '', 
        department: '', 
        expectedBenefit: '', 
        frequency: '', 
        submitterName: '',
        currentProcessTitle: '',
        currentProcessProblem: '',
        isManualProcess: false,
        involvesMultipleDepartments: false,
        involvedDepartments: []
      });
      onSubmitSuccess(idea);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDepartmentToggle = (dept: Department) => {
    setFormData(prev => ({
      ...prev,
      involvedDepartments: prev.involvedDepartments.includes(dept)
        ? prev.involvedDepartments.filter(d => d !== dept)
        : [...prev.involvedDepartments, dept]
    }));
  };

  const inputClass = (field: string) => 
    `w-full px-3 py-2.5 rounded-md border transition-all duration-200 outline-none text-sm ${
      errors[field] 
        ? 'border-red-400 bg-red-50 focus:border-red-500' 
        : 'border-gray-300 bg-white focus:border-primary-600 focus:ring-1 focus:ring-primary-600'
    }`;

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Section: Idea Details */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Idea Details</h3>
        
        {/* Two column layout for title and name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Idea Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="Enter idea title" 
              className={inputClass('title')} 
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.submitterName} 
              onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })} 
              placeholder="Enter your full name" 
              className={inputClass('submitterName')} 
            />
            {errors.submitterName && <p className="mt-1 text-xs text-red-500">{errors.submitterName}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            placeholder="Describe your idea in detail" 
            rows={3} 
            className={inputClass('description')} 
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Section: Current Process */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Current Process Information</h3>
        
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Current Process Title</label>
            <input 
              type="text" 
              value={formData.currentProcessTitle} 
              onChange={(e) => setFormData({ ...formData, currentProcessTitle: e.target.value })} 
              placeholder="What is the name of the current process?" 
              className={inputClass('currentProcessTitle')} 
            />
          </div>

          <div>
            <label className={labelClass}>Current Process Problem / Description</label>
            <textarea 
              value={formData.currentProcessProblem} 
              onChange={(e) => setFormData({ ...formData, currentProcessProblem: e.target.value })} 
              placeholder="Describe the problems encountered with the current process" 
              rows={3} 
              className={inputClass('currentProcessProblem')} 
            />
          </div>

          {/* Toggle buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Is Manual Process Toggle */}
            <div>
              <label className={labelClass}>Is the current process manual?</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isManualProcess: true })}
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    formData.isManualProcess 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isManualProcess: false })}
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    !formData.isManualProcess 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Involves Multiple Departments Toggle */}
            <div>
              <label className={labelClass}>Does this process involve multiple departments?</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, involvesMultipleDepartments: true })}
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    formData.involvesMultipleDepartments 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, involvesMultipleDepartments: false, involvedDepartments: [] })}
                  className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    !formData.involvesMultipleDepartments 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Show department selection if multiple departments */}
          {formData.involvesMultipleDepartments && (
            <div>
              <label className={labelClass}>Which departments are involved?</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDepartmentToggle(dept)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      formData.involvedDepartments.includes(dept)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section: Additional Details */}
      <div className="pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Additional Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Department <span className="text-red-500">*</span></label>
            <select 
              value={formData.department} 
              onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })} 
              className={inputClass('department')}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((dept: Department) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
          </div>

          <div>
            <label className={labelClass}>Expected Benefit <span className="text-red-500">*</span></label>
            <select 
              value={formData.expectedBenefit} 
              onChange={(e) => setFormData({ ...formData, expectedBenefit: e.target.value as ExpectedBenefit })} 
              className={inputClass('expectedBenefit')}
            >
              <option value="">Select expected benefit</option>
              {EXPECTED_BENEFITS.map((benefit: ExpectedBenefit) => <option key={benefit} value={benefit}>{benefit}</option>)}
            </select>
            {errors.expectedBenefit && <p className="mt-1 text-xs text-red-500">{errors.expectedBenefit}</p>}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className={labelClass}>Frequency <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={formData.frequency} 
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} 
            placeholder="e.g., Daily, Weekly, Monthly" 
            className={inputClass('frequency')} 
          />
          {errors.frequency && <p className="mt-1 text-xs text-red-500">{errors.frequency}</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button 
          type="button" 
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Idea'}
        </button>
      </div>
    </form>
  );
}
