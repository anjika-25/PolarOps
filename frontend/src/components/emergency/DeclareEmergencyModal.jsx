import React, { useState } from 'react';
import { X, AlertTriangle, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

const DeclareEmergencyModal = ({ isOpen, onClose, onSubmit, submitting, submitError }) => {
  const [formData, setFormData] = useState({
    type: 'Medical',
    location: 'Maitri Station',
    severity: 'Critical',
    affected_personnel: '',
  });

  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type) {
      setValidationError('Please select an emergency type.');
      return;
    }
    if (!formData.location) {
      setValidationError('Please select an incident location.');
      return;
    }
    if (!formData.severity) {
      setValidationError('Please select a severity level.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-lg border border-polar-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B1F33] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Declare Emergency Incident
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Error Banner */}
          {(submitError || validationError) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Validation / Submission Error:</span>
                <p className="mt-0.5">{validationError || submitError}</p>
              </div>
            </div>
          )}

          {/* Type Select */}
          <div>
            <label className="block text-[11px] font-bold text-polar-textMuted uppercase mb-1">
              Emergency Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={submitting}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-polar-text font-medium focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary"
            >
              <option value="Medical">Medical</option>
              <option value="Vehicle Failure">Vehicle Failure</option>
              <option value="Fire">Fire</option>
              <option value="Severe Weather">Severe Weather</option>
              <option value="Missing Personnel">Missing Personnel</option>
            </select>
          </div>

          {/* Location Select */}
          <div>
            <label className="block text-[11px] font-bold text-polar-textMuted uppercase mb-1">
              Location / Station <span className="text-rose-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={submitting}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-polar-text font-medium focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary"
            >
              <option value="Maitri Station">Maitri Station</option>
              <option value="Bharati Station">Bharati Station</option>
              <option value="Himadri Station">Himadri Station</option>
              <option value="Field Camp A">Field Camp A</option>
              <option value="Field Camp B">Field Camp B</option>
            </select>
          </div>

          {/* Severity Radio/Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-polar-textMuted uppercase mb-1">
              Severity Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Critical', 'High', 'Medium'].map((sev) => {
                const isSelected = formData.severity === sev;
                let activeBorder = 'border-slate-300 bg-slate-50 text-slate-700';
                if (isSelected) {
                  if (sev === 'Critical') activeBorder = 'border-rose-600 bg-rose-50 text-rose-900 font-bold';
                  else if (sev === 'High') activeBorder = 'border-amber-600 bg-amber-50 text-amber-900 font-bold';
                  else activeBorder = 'border-blue-600 bg-blue-50 text-blue-900 font-bold';
                }

                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, severity: sev }))}
                    className={`py-2 px-3 rounded border text-center font-medium transition-colors ${activeBorder}`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affected Personnel Input */}
          <div>
            <label className="block text-[11px] font-bold text-polar-textMuted uppercase mb-1">
              Affected Personnel <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="affected_personnel"
              value={formData.affected_personnel}
              onChange={handleChange}
              placeholder="e.g. Dr. Rajesh Kumar / Field Team 3"
              disabled={submitting}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Declare Emergency</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclareEmergencyModal;
