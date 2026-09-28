import React from 'react';
import { History, ShieldAlert, MapPin, Calendar, User } from 'lucide-react';

const RecentIncidentsList = ({ incidents, onSelectIncident, currentIncidentId }) => {
  if (!incidents || incidents.length === 0) return null;

  // Filter out current active incident if shown at top
  const pastIncidents = currentIncidentId
    ? incidents.filter((inc) => inc.incident_id !== currentIncidentId)
    : incidents;

  if (pastIncidents.length === 0) return null;


  const renderSeverityBadge = (severity) => {
    const s = (severity || '').toUpperCase();
    if (s === 'CRITICAL') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          Critical
        </span>
      );
    }
    if (s === 'HIGH') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          High
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
        Medium
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider pb-2 border-b border-polar-border">
        <History className="w-4 h-4 text-polar-primary" />
        <span>Recent Emergency Log History ({pastIncidents.length})</span>
      </div>

      <div className="divide-y divide-polar-border">
        {pastIncidents.map((inc) => {
          const formattedDate = inc.created_at
            ? new Date(inc.created_at).toLocaleString('en-IN', {
                dateStyle: 'short',
                timeStyle: 'short',
              })
            : 'N/A';

          return (
            <div
              key={inc.incident_id}
              onClick={() => onSelectIncident(inc)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 rounded px-2 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-polar-primary">
                      #{inc.incident_id}
                    </span>
                    <span className="font-bold text-polar-text">
                      {inc.type} Emergency
                    </span>
                    {renderSeverityBadge(inc.severity)}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-polar-textMuted mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {inc.location}
                    </span>
                    {inc.affected_personnel && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {inc.affected_personnel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formattedDate}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700 uppercase">
                  {inc.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentIncidentsList;
