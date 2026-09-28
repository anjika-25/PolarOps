import React from 'react';
import { Filter, RotateCcw, Package, MapPin, AlertCircle } from 'lucide-react';

const CargoTable = ({ cargo = [], filters, onFilterChange, onResetFilters, loading, error, onRetry }) => {
  const destinations = [
    "Maitri Station",
    "Bharati Station",
    "Himadri Station",
    "Field Camp A",
    "Field Camp B"
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELAYED') return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    if (s === 'IN TRANSIT') return 'bg-blue-50 text-blue-800 border-blue-200 font-semibold';
    if (s === 'DELIVERED') return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'HIGH') return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
    if (p === 'MEDIUM') return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
    if (p === 'LOW') return 'bg-slate-100 text-slate-700 border-slate-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-4">
      {/* Filter Control Bar */}
      <div className="bg-white rounded-lg border border-polar-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-polar-border">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-polar-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-polar-text">
              Filter Cargo Transits
            </h3>
          </div>
          {(filters.status || filters.priority || filters.destination) && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-polar-primary font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
              Shipment Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
            >
              <option value="">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
              Shipment Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
              Destination Location
            </label>
            <select
              value={filters.destination || ''}
              onChange={(e) => onFilterChange('destination', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
            >
              <option value="">All Destinations</option>
              {destinations.map((dest) => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cargo Table */}
      <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-polar-textMuted gap-3">
            <Package className="w-8 h-8 text-polar-primary animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider">Fetching Cargo Records...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 text-rose-800 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error Loading Cargo Data:</span>
                <p className="mt-1">{error}</p>
                <button
                  onClick={onRetry}
                  className="mt-3 px-3 py-1 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-50 text-polar-textMuted font-semibold border-b border-polar-border uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cargo ID</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-border font-medium">
                {cargo.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-polar-textMuted">
                      No cargo records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  cargo.map((item) => (
                    <tr key={item.cargo_id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Cargo ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-polar-primary">
                        #{item.cargo_id}
                      </td>

                      {/* 2. Item */}
                      <td className="py-3.5 px-4 text-polar-text">
                        <div className="font-bold text-slate-900">{item.cargo_name}</div>
                        <div className="text-[11px] text-polar-textMuted font-normal">
                          Category: {item.category} ({item.quantity} units)
                        </div>
                      </td>

                      {/* 3. Destination */}
                      <td className="py-3.5 px-4 text-polar-textMuted">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.destination}</span>
                        </div>
                      </td>

                      {/* 4. Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* 5. Priority */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getPriorityBadge(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoTable;
