import React from 'react';
import {
  TrendingDown,
  Clock,
  AlertTriangle,
  Calendar,
  Activity,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const InventoryPredictionPanel = ({
  inventoryItems = [],
  selectedItemId,
  onSelectItem,
  predictionData,
  loading,
  error,
  onRetry
}) => {
  const selectedItem = inventoryItems.find((i) => i.item_id === Number(selectedItemId));

  const renderDaysRemaining = (days, status) => {
    if (days === null || days === undefined || status === "Insufficient usage data") {
      return (
        <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          Insufficient usage data
        </span>
      );
    }

    if (days <= 0) {
      return (
        <span className="text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded border border-rose-200 flex items-center gap-1.5 inline-flex">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>0.0 Days (At/Below Threshold)</span>
        </span>
      );
    }

    return (
      <span className="text-polar-primary font-extrabold text-base bg-blue-50/80 px-3 py-1 rounded border border-blue-200 font-mono">
        {days} Days
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-polar-border shadow-sm p-5 space-y-5">
      {/* Panel Header & Item Selection Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-polar-border">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <TrendingDown className="w-5 h-5 text-polar-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Fuel & Inventory Depletion Prediction
            </h3>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            7-day average daily usage calculation and depletion estimate from PostgreSQL usage history.
          </p>
        </div>

        {/* Item Selection Dropdown */}
        <div className="min-w-[240px]">
          <label className="block text-[10px] font-bold text-polar-textMuted uppercase mb-1">
            Select Inventory Item
          </label>
          <select
            value={selectedItemId || ''}
            onChange={(e) => onSelectItem(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-3 py-2 text-polar-text focus:outline-none focus:ring-1 focus:ring-polar-primary"
          >
            <option value="">-- Choose Item for Prediction --</option>
            {inventoryItems.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.item_name} ({item.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Body States */}
      {!selectedItemId ? (
        /* State 1: No Item Selected */
        <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <Flame className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-polar-text uppercase tracking-wider">
            No Inventory Item Selected
          </h4>
          <p className="text-xs text-polar-textMuted mt-1 max-w-sm mx-auto">
            Select an inventory item above or click "View Prediction" on any item in the table to load 7-day usage history and depletion estimates.
          </p>
        </div>
      ) : loading ? (
        /* State 2: Loading Prediction */
        <div className="py-16 flex flex-col items-center justify-center text-polar-textMuted gap-3">
          <RefreshCw className="w-7 h-7 text-polar-primary animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Fetching 7-Day Usage History & Depletion Estimates...
          </span>
        </div>
      ) : error ? (
        /* State 3: API Error */
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Prediction Fetch Error:</span>
              <p className="mt-1">{error}</p>
              <button
                onClick={onRetry}
                className="mt-3 px-3 py-1 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800 transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          </div>
        </div>
      ) : predictionData ? (
        /* State 4 / 5: Successful Prediction or Insufficient Data */
        <div className="space-y-6">
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Current Stock */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-polar-textMuted uppercase block">
                Current Stock
              </span>
              <div className="text-base font-bold text-polar-text mt-1 font-mono">
                {predictionData.current_stock.toLocaleString()} {predictionData.unit}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Location: {predictionData.location}
              </span>
            </div>

            {/* Minimum Threshold */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-polar-textMuted uppercase block">
                Minimum Required Stock
              </span>
              <div className="text-base font-bold text-slate-700 mt-1 font-mono">
                {predictionData.minimum_required_stock.toLocaleString()} {predictionData.unit}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Safety reserve threshold
              </span>
            </div>

            {/* Average Daily Usage */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-polar-textMuted uppercase block">
                Average Daily Usage (7-Day)
              </span>
              <div className="text-base font-bold text-polar-primary mt-1 font-mono">
                {predictionData.average_daily_usage.toLocaleString()} {predictionData.unit}/day
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Calculated from 7-day window
              </span>
            </div>

            {/* Estimated Days Remaining */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between">
              <span className="text-[10px] font-bold text-polar-textMuted uppercase block">
                Estimated Days Remaining
              </span>
              <div className="mt-1">
                {renderDaysRemaining(predictionData.estimated_days_remaining, predictionData.prediction_status)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Status: {predictionData.prediction_status}
              </span>
            </div>
          </div>

          {/* Recharts Visualization & 7-Day Usage History Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Left 2 Cols: Recharts 7-Day Consumption Area Chart */}
            <div className="lg:col-span-2 space-y-3 bg-slate-50/60 p-4 border border-slate-200 rounded">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4 text-polar-primary" />
                  <span>7-Day Stored Usage History Graph</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Daily Usage ({predictionData.unit})
                </span>
              </div>

              {predictionData.usage_history && predictionData.usage_history.length > 0 ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[...predictionData.usage_history].reverse()} // Show chronological left to right
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2F6F95" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2F6F95" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        unit={` ${predictionData.unit === 'Liters' ? 'L' : ''}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1F33',
                          borderColor: '#2F6F95',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [`${value} ${predictionData.unit}`, 'Quantity Used']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="quantity_used"
                        stroke="#2F6F95"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#usageGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No usage history records available for chart visualization.
                </div>
              )}
            </div>

            {/* Right 1 Col: 7-Day Usage History Table */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-polar-text uppercase tracking-wider pb-2 border-b border-polar-border">
                <Calendar className="w-4 h-4 text-polar-primary" />
                <span>Usage Log ({predictionData.usage_history.length} Days)</span>
              </div>

              <div className="overflow-x-auto border border-polar-border rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0B1F33] text-white font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Quantity Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-polar-border font-medium">
                    {predictionData.usage_history.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-6 text-center text-slate-400">
                          No history records.
                        </td>
                      </tr>
                    ) : (
                      predictionData.usage_history.map((record, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 font-mono">
                          <td className="py-2 px-3 text-slate-700">
                            {record.date}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-polar-primary">
                            {record.quantity_used.toLocaleString()} {predictionData.unit}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InventoryPredictionPanel;
