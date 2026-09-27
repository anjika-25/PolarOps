import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import KPICard from '../components/dashboard/KPICard';
import ExpeditionStatus from '../components/dashboard/ExpeditionStatus';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import OperationalMap from '../components/dashboard/OperationalMap';
import { Compass, Users, Package, AlertTriangle, RefreshCw, AlertCircle, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await dashboardService.getSummary();
      setData(summary);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load operational dashboard data from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-20 text-polar-text">
        <div className="p-4 bg-white rounded-xl border border-polar-border shadow-sm flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-polar-primary animate-spin" />
          <div className="text-xs uppercase font-bold tracking-wider text-polar-textMuted">
            Fetching Operational Dashboard Data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 shadow-sm max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Operational Data Fetch Failed</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetching
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || { active_expeditions: 0, total_personnel: 0, total_cargo: 0, active_alerts: 0 };
  const expeditions = data?.expeditions || [];
  const alerts = data?.alerts || [];

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <LayoutDashboard className="w-5 h-5 text-polar-primary" />
            <h1 className="text-lg font-bold uppercase tracking-wider">Command Center Overview</h1>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Real-time operational logistics, field station monitoring, and operational alerts across polar bases.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-polar-text border border-polar-border shadow-sm transition-colors"
          title="Refresh Dashboard Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 1. Live KPI Cards (Calculated directly from PostgreSQL database via API) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Expeditions"
          value={kpis.active_expeditions}
          icon={Compass}
          description="Operational field missions in Antarctica & Arctic"
        />
        <KPICard
          title="Total Personnel"
          value={kpis.total_personnel}
          icon={Users}
          description="Station scientists, engineers & field officers"
        />
        <KPICard
          title="Total Cargo"
          value={kpis.total_cargo}
          icon={Package}
          description="Registered supply & equipment shipments"
        />
        <KPICard
          title="Active Alerts"
          value={kpis.active_alerts}
          icon={AlertTriangle}
          description="Maintenance, personnel & transit alerts"
          alertCount={kpis.active_alerts}
          isAlert={true}
        />
      </div>

      {/* 2. Main Dashboard Layout (Operational Map + Expedition Statuses | Recent Alerts Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): Operational Map & Expedition Status Table */}
        <div className="lg:col-span-2 space-y-6">
          <OperationalMap />
          <ExpeditionStatus expeditions={expeditions} />
        </div>

        {/* Right Column (1/3 width): Recent Operational Alerts Feed */}
        <div className="lg:col-span-1">
          <RecentAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
