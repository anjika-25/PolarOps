import React from 'react';
import { AlertTriangle, MapPin, ShieldAlert } from 'lucide-react';

const LowStockAlertBanner = ({ alerts = [] }) => {
  // Filter alerts for inventory low-stock alerts
  const lowStockAlerts = alerts.filter(
    (a) =>
      a.category === 'INVENTORY' ||
      a.id.startsWith('inventory-low-') ||
      (a.title && a.title.toLowerCase().includes('low stock'))
  );

  if (!lowStockAlerts || lowStockAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-4 shadow-sm space-y-3 mb-4">
      <div className="flex items-center justify-between pb-2 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Active Inventory Low-Stock Alerts ({lowStockAlerts.length})
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
          Action Required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lowStockAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white p-3.5 rounded border border-amber-200 shadow-2xs flex flex-col justify-between space-y-2 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Low Stock
                </span>
                <h4 className="font-bold text-slate-900 leading-snug mt-0.5">
                  {alert.title}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                {alert.severity}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {alert.description}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Location: {alert.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlertBanner;
