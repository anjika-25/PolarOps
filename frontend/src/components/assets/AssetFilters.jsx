import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const AssetFilters = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = filters.location || filters.condition || filters.maintenance_status;

  return (
    <div className="bg-white p-4 rounded-lg border border-polar-border shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Title & Icon */}
        <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider shrink-0">
          <Filter className="w-4 h-4 text-polar-primary" />
          <span>Filter Assets</span>
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Location Filter */}
          <div>
            <label className="block text-[10px] font-bold text-polar-textMuted uppercase mb-1">
              Station / Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary font-medium"
            >
              <option value="">All Locations</option>
              <option value="Maitri Station">Maitri Station</option>
              <option value="Bharati Station">Bharati Station</option>
              <option value="Himadri Station">Himadri Station</option>
              <option value="Field Camp A">Field Camp A</option>
              <option value="Field Camp B">Field Camp B</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[10px] font-bold text-polar-textMuted uppercase mb-1">
              Condition
            </label>
            <select
              value={filters.condition}
              onChange={(e) => onFilterChange('condition', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary font-medium"
            >
              <option value="">All Conditions</option>
              <option value="Good">Good</option>
              <option value="Operational">Operational</option>
              <option value="Fair">Fair</option>
              <option value="Degraded">Degraded</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Maintenance Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-polar-textMuted uppercase mb-1">
              Maintenance Status
            </label>
            <select
              value={filters.maintenance_status}
              onChange={(e) => onFilterChange('maintenance_status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary focus:border-polar-primary font-medium"
            >
              <option value="">All Maintenance Statuses</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="DUE SOON">DUE SOON</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>
        </div>

        {/* Reset Action Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors shrink-0 self-end md:self-center"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AssetFilters;
