import React from 'react';
import { HardDrive, MapPin, AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const AssetTable = ({ assets, onRowClick, selectedAssetId }) => {
  if (!assets || assets.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-polar-border p-12 text-center shadow-sm">
        <HardDrive className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-polar-text">No Asset Records Found</h3>
        <p className="text-xs text-polar-textMuted mt-1">
          No equipment matching the selected filter criteria is currently registered.
        </p>
      </div>
    );
  }

  // Render maintenance status badge strictly based on API returned maintenance_status
  const renderMaintenanceBadge = (maintStatus, storedStatus) => {
    const statusUpper = (maintStatus || '').toUpperCase();

    if (statusUpper === 'OVERDUE') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>OVERDUE</span>
        </div>
      );
    }

    if (statusUpper === 'DUE SOON') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>DUE SOON</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>NORMAL</span>
      </div>
    );
  };

  const getConditionColor = (condition) => {
    const c = (condition || '').toLowerCase();
    if (c === 'critical') return 'text-rose-700 font-bold';
    if (c === 'degraded' || c === 'under repair') return 'text-amber-700 font-semibold';
    if (c === 'good' || c === 'operational') return 'text-slate-700 font-medium';
    return 'text-slate-600';
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left border-collapse text-xs">
          {/* Exact required columns */}
          <thead>
            <tr className="bg-[#0B1F33] text-white font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-28">Asset ID</th>
              <th className="py-3 px-4">Equipment</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Condition</th>
              <th className="py-3 px-4">Maintenance Due</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-polar-border">
            {assets.map((item) => {
              const isSelected = selectedAssetId === item.asset_id;

              return (
                <tr
                  key={item.asset_id}
                  onClick={() => onRowClick(item.asset_id)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isSelected
                      ? 'bg-blue-50/80 hover:bg-blue-50 font-medium'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Asset ID */}
                  <td className="py-3 px-4 font-mono font-bold text-polar-primary">
                    #{item.asset_id}
                  </td>

                  {/* Equipment */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-polar-text">
                      {item.equipment || item.asset_name}
                    </div>
                    {item.asset_type && (
                      <div className="text-[11px] text-polar-textMuted mt-0.5">
                        {item.asset_type}
                      </div>
                    )}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.location || item.current_location}</span>
                    </div>
                  </td>

                  {/* Condition */}
                  <td className="py-3 px-4">
                    <span className={`capitalize ${getConditionColor(item.condition)}`}>
                      {item.condition || 'N/A'}
                    </span>
                  </td>

                  {/* Maintenance Due */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.maintenance_due || item.next_maintenance || 'N/A'}</span>
                    </div>
                  </td>

                  {/* Status & Maintenance Status Indicator */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {renderMaintenanceBadge(item.maintenance_status, item.status)}
                      {item.status && (
                        <span className="text-[10px] text-slate-500 tracking-tight">
                          {item.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
