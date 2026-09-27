import React from 'react';

const KPICard = ({ title, value, icon: Icon, description, alertCount, isAlert }) => {
  return (
    <div className={`bg-white rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md ${
      isAlert && alertCount > 0 ? 'border-amber-300/80 bg-amber-50/20' : 'border-polar-border'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-polar-textMuted">
          {title}
        </span>
        <div className={`p-2 rounded-md ${
          isAlert && alertCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-polar-primary'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-polar-text tracking-tight">
          {value !== undefined && value !== null ? value.toLocaleString() : '—'}
        </div>
        {isAlert && alertCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            {alertCount} Active
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-[11px] text-polar-textMuted">
          {description}
        </p>
      )}
    </div>
  );
};

export default KPICard;
