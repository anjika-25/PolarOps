import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';

const PersonnelFilters = ({ filters, expeditions = [], onFilterChange, onReset }) => {
  const locations = [
    "Maitri Station",
    "Bharati Station",
    "Himadri Station",
    "Field Camp A",
    "Field Camp B",
    "ORV Sagar Nidhi",
    "In Transit"
  ];

  const statuses = [
    { label: "Active", value: "Active" },
    { label: "In Transit", value: "In Transit" },
    { label: "Unreachable", value: "UNREACHABLE" }
  ];

  return (
    <div className="bg-white rounded-lg border border-polar-border p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-polar-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-polar-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-polar-text">
            Filter Personnel Directory
          </h3>
        </div>
        {(filters.expedition_id || filters.location || filters.status) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-polar-primary font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expedition Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
            Expedition Mission
          </label>
          <select
            value={filters.expedition_id || ''}
            onChange={(e) => onFilterChange('expedition_id', e.target.value ? Number(e.target.value) : '')}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
          >
            <option value="">All Expeditions</option>
            {expeditions.map((exp) => (
              <option key={exp.expedition_id} value={exp.expedition_id}>
                {exp.name} ({exp.base})
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
            Current Location / Station
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
            Personnel Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
          >
            <option value="">All Statuses</option>
            {statuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PersonnelFilters;
