import React from 'react';
import { HardDrive, Clock } from 'lucide-react';

const Assets = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5 text-[#0B1F33]">
          <HardDrive className="w-6 h-6 text-[#2F6F95]" />
          <h1 className="text-xl font-bold tracking-tight">Assets</h1>
        </div>
        <p className="text-xs text-polar-textMuted mt-1">
          Equipment health monitoring, power generator lifecycle management, snow vehicle readiness, and maintenance scheduling for polar station assets.
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
            The Asset tracking, condition monitoring, overdue maintenance indicators, and asset detail side-panel module is scheduled for implementation in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assets;
