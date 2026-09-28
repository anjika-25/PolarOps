import React from 'react';
import { Compass, User, MapPin } from 'lucide-react';

const ExpeditionStatus = ({ expeditions = [] }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ON TRACK':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ACTIVE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DELAYED':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-polar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-polar-primary" />
          <h3 className="text-sm font-bold text-polar-text uppercase tracking-wider">
            Active Expeditions Status
          </h3>
        </div>
        <span className="text-xs text-polar-textMuted font-medium">
          {expeditions.length} Missions Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-xs">
          <thead className="bg-slate-50 text-polar-textMuted font-semibold border-b border-polar-border uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Expedition Mission</th>
              <th className="py-3 px-4">Station Base / Region</th>
              <th className="py-3 px-4">Mission Leader</th>
              <th className="py-3 px-4">Current Phase</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-polar-border font-medium">
            {expeditions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-polar-textMuted">
                  No active expedition missions found.
                </td>
              </tr>
            ) : (
              expeditions.map((exp) => (
                <tr key={exp.expedition_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-polar-text">
                    {exp.name}
                  </td>
                  <td className="py-3.5 px-4 text-polar-textMuted">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{exp.base}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-polar-text">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{exp.leader}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-polar-textMuted">
                    {exp.phase}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase ${getStatusBadge(exp.status)}`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpeditionStatus;
