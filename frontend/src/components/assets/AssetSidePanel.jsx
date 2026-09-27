import React, { useState, useEffect } from 'react';
import { assetService } from '../../services/assetService';
import {
  X,
  HardDrive,
  MapPin,
  Users,
  Calendar,
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const AssetSidePanel = ({ assetId, isOpen, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assetId || !isOpen) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await assetService.getAssetById(assetId);
        setDetail(data);
      } catch (err) {
        console.error("Asset Detail API Error:", err);
        setError(err.response?.data?.detail || err.message || "Failed to load asset details from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [assetId, isOpen]);

  if (!isOpen) return null;

  const renderMaintenanceBadge = (maintStatus) => {
    const statusUpper = (maintStatus || '').toUpperCase();

    if (statusUpper === 'OVERDUE') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>OVERDUE</span>
        </div>
      );
    }

    if (statusUpper === 'DUE SOON') {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>DUE SOON</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>NORMAL</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-polar-border shadow-2xl z-50 flex flex-col justify-between">
      {/* Panel Header */}
      <div className="p-4 bg-[#0B1F33] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-polar-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Asset Record Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Asset Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-polar-textMuted gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-polar-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Loading Asset Details...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error Loading Details:</span>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : detail ? (
          <>
            {/* Equipment Name & Maintenance Status Badge */}
            <div className="pb-4 border-b border-polar-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-polar-text leading-tight">
                    {detail.equipment || detail.asset_name}
                  </h2>
                  <p className="text-xs text-polar-primary font-semibold mt-0.5">
                    {detail.asset_type}
                  </p>
                </div>
                {renderMaintenanceBadge(detail.maintenance_status)}
              </div>
            </div>

            {/* Required Details List */}
            <div className="space-y-4 text-xs">
              {/* Asset ID */}
              <div className="flex items-start gap-3">
                <HardDrive className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Asset ID</div>
                  <div className="font-mono font-bold text-polar-primary">#{detail.asset_id}</div>
                </div>
              </div>

              {/* Equipment / Asset Name */}
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Equipment Name</div>
                  <div className="font-semibold text-polar-text">{detail.equipment || detail.asset_name}</div>
                </div>
              </div>

              {/* Asset Type */}
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Asset Category / Type</div>
                  <div className="font-medium text-polar-text">{detail.asset_type}</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Current Station / Location</div>
                  <div className="font-semibold text-polar-text">{detail.location || detail.current_location}</div>
                </div>
              </div>

              {/* Condition */}
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Equipment Condition</div>
                  <div className="font-semibold text-polar-text">{detail.condition}</div>
                </div>
              </div>

              {/* Assigned Team */}
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Assigned Team</div>
                  <div className="font-medium text-polar-text">{detail.assigned_team || 'Unassigned / Station Pool'}</div>
                </div>
              </div>

              {/* Last Maintenance */}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Last Maintenance Date</div>
                  <div className="font-mono text-polar-text">{detail.last_maintenance || 'N/A'}</div>
                </div>
              </div>

              {/* Next Maintenance */}
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Next Maintenance Due</div>
                  <div className="font-mono font-bold text-polar-text">
                    {detail.next_maintenance || detail.maintenance_due || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Operational Status */}
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Operational Status</div>
                  <div className="font-semibold text-polar-text">{detail.status}</div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Panel Footer */}
      <div className="p-3 bg-slate-50 border-t border-polar-border text-[11px] text-polar-textMuted text-center font-mono">
        PolarOps Asset Spec: #{assetId}
      </div>
    </div>
  );
};

export default AssetSidePanel;
