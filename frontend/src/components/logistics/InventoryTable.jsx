import React from 'react';
import { Filter, RotateCcw, Package, MapPin, Edit3, AlertCircle } from 'lucide-react';

const InventoryTable = ({ inventory = [], filters, onFilterChange, onResetFilters, onEditClick, loading, error, onRetry }) => {
  const locations = [
    "Maitri Station",
    "Bharati Station",
    "Himadri Station",
    "Field Camp A",
    "Field Camp B"
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'LOW') {
      return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    }
    return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
  };

  return (
    <div className="space-y-4">
      {/* Filter Control Bar */}
      <div className="bg-white rounded-lg border border-polar-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-polar-border">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-polar-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-polar-text">
              Filter Inventory Stock
            </h3>
          </div>
          {(filters.location || filters.status) && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-polar-primary font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
              Station Location
            </label>
            <select
              value={filters.location || ''}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Derived Stock Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-polar-textMuted mb-1.5">
              Stock Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
            >
              <option value="">All Statuses</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-polar-textMuted gap-3">
            <Package className="w-8 h-8 text-polar-primary animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider">Fetching Inventory Stock...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 text-rose-800 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error Loading Inventory Data:</span>
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
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-polar-textMuted font-semibold border-b border-polar-border uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Minimum Required</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-border font-medium">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-polar-textMuted">
                      No inventory records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.item_id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Item */}
                      <td className="py-3.5 px-4 text-polar-text">
                        <div className="font-bold text-slate-900">{item.item_name}</div>
                        <div className="text-[11px] text-polar-textMuted font-normal">
                          Category: {item.category}
                        </div>
                      </td>

                      {/* 2. Location */}
                      <td className="py-3.5 px-4 text-polar-textMuted">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </td>

                      {/* 3. Current Stock */}
                      <td className="py-3.5 px-4 text-right font-bold text-polar-text">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>

                      {/* 4. Minimum Required */}
                      <td className="py-3.5 px-4 text-right text-polar-textMuted">
                        {item.minimum_threshold.toLocaleString()} {item.unit}
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Action: Edit Stock Quantity */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onEditClick(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-[#2F6F95] hover:text-white text-slate-700 font-semibold text-[11px] border border-slate-200 transition-colors shadow-2xs"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Stock</span>
                        </button>
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

export default InventoryTable;
