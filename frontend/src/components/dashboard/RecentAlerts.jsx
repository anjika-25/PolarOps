import React from 'react';
import { AlertTriangle, HardDrive, Users, Package, ShieldAlert, MapPin, Clock } from 'lucide-react';

const RecentAlerts = ({ alerts = [] }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ASSET':
        return HardDrive;
      case 'PERSONNEL':
        return Users;
      case 'CARGO':
        return Package;
      case 'EMERGENCY':
        return ShieldAlert;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm flex flex-col h-[480px] overflow-hidden">
      <div className="px-5 py-4 border-b border-polar-border flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-polar-text uppercase tracking-wider">
            Recent Operational Alerts
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {alerts.length} Active
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-polar-border">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-polar-textMuted text-xs font-medium">
            No active operational alerts detected.
          </div>
        ) : (
          alerts.map((alert) => {
            const CategoryIcon = getCategoryIcon(alert.category);
            const timeStr = formatTimestamp(alert.timestamp);

            return (
              <div key={alert.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-polar-text">
                          {alert.title}
                        </h4>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-polar-textMuted mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-polar-textMuted">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold">{alert.location}</span>
                  </div>
                  {timeStr && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{timeStr}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentAlerts;
