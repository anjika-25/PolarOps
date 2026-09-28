import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  Navigation,
  Activity,
  Layers,
  Calendar
} from 'lucide-react';

const ActiveIncidentCard = ({ incident, onResolve, resolving, canResolve }) => {
  if (!incident) return null;

  const renderSeverityBadge = (severity) => {
    const s = (severity || '').toUpperCase();
    if (s === 'CRITICAL') {
      return (
        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          Critical
        </span>
      );
    }
    if (s === 'HIGH') {
      return (
        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          High
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
        Medium
      </span>
    );
  };

  const formattedDate = incident.created_at
    ? new Date(incident.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Just now';

  const checklist = incident.checklist || {
    incident_created: true,
    team_notified: false,
    vehicle_assigned: false,
  };

  const resources = incident.response_resources || [];

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm overflow-hidden space-y-0">
      {/* Incident Header Banner */}
      <div className="bg-rose-950 text-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rose-900">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-900 rounded border border-rose-700 text-rose-200 shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-rose-300">
                INCIDENT #{incident.incident_id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-800 text-white uppercase tracking-wider">
                {incident.status || 'ACTIVE'}
              </span>
              {renderSeverityBadge(incident.severity)}
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {incident.type} Emergency
            </h2>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-rose-200 font-mono">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>{formattedDate}</span>
          </div>

          {(incident.status || '').toUpperCase() === 'ACTIVE' && canResolve && (
            <button
              onClick={() => onResolve && onResolve(incident.incident_id)}
              disabled={resolving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              title="Mark incident as resolved in system"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{resolving ? 'Resolving...' : 'Mark as Resolved'}</span>
            </button>
          )}
        </div>
      </div>


      {/* Incident Core Info Grid */}
      <div className="p-5 border-b border-polar-border bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-polar-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-polar-textMuted uppercase block">Location</span>
            <span className="font-semibold text-polar-text">{incident.location}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-polar-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-polar-textMuted uppercase block">Affected Personnel</span>
            <span className="font-semibold text-polar-text">
              {incident.affected_personnel || 'None reported / General hazard'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-polar-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-polar-textMuted uppercase block">Severity Rating</span>
            <span className="font-semibold text-polar-text">{incident.severity}</span>
          </div>
        </div>
      </div>

      {/* Response Checklist & Simulated Response Resources Section */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Response Checklist */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider pb-2 border-b border-polar-border">
            <Layers className="w-4 h-4 text-polar-primary" />
            <span>Response Checklist</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Step 1: Incident Created */}
            <div className="flex items-center justify-between p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Incident Created</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Completed
              </span>
            </div>

            {/* Step 2: Team Notified */}
            <div className={`flex items-center justify-between p-3 rounded border text-xs ${
              checklist.team_notified
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                {checklist.team_notified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-semibold">Team Notified</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                checklist.team_notified
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {checklist.team_notified ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Step 3: Vehicle Assigned */}
            <div className={`flex items-center justify-between p-3 rounded border text-xs ${
              checklist.vehicle_assigned
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                {checklist.vehicle_assigned ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-semibold">Vehicle Assigned</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                checklist.vehicle_assigned
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {checklist.vehicle_assigned ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): Simulated Response Resources */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-polar-border">
            <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-polar-primary" />
              <span>Simulated Response Resources</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Operational Data
            </span>
          </div>

          <div className="overflow-x-auto border border-polar-border rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B1F33] text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Resource Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Base Location</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Est. ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-border">
                {resources.map((res) => (
                  <tr key={res.resource_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-polar-text">
                      {res.name}
                    </td>
                    <td className="py-2.5 px-3 text-polar-textMuted">
                      {res.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {res.base_location}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-polar-primary">
                      {res.distance_km} km
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                        {res.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {res.estimated_eta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveIncidentCard;
