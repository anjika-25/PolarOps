import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const Emergency = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5 text-[#0B1F33]">
          <AlertTriangle className="w-6 h-6 text-[#2F6F95]" />
          <h1 className="text-xl font-bold tracking-tight">Emergency Response</h1>
        </div>
        <p className="text-xs text-polar-textMuted mt-1">
          Incident declaration, emergency response coordination, resource allocation, and evacuation checklist workflows for active polar incidents.
        </p>
      </div>

      {/* Restrained Placeholder Card */}
      <div className="bg-white rounded-lg border border-polar-border p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="p-3 bg-slate-100 rounded-full border border-slate-200 mb-3">
            <Clock className="w-6 h-6 text-polar-textMuted" />
          </div>
          <h2 className="text-sm font-semibold text-polar-text mb-1">
            Module Under Preparation
          </h2>
          <p className="text-xs text-polar-textMuted max-w-md">
            The Emergency declaration modal, active incident state transformation, resource mapping, and incident response checklist module is scheduled for implementation in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
