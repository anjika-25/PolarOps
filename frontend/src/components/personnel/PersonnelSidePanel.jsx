import React, { useState, useEffect } from 'react';
import { personnelService } from '../../services/personnelService';
import { X, User, MapPin, Compass, Phone, ShieldCheck, Activity, RefreshCw, AlertCircle, Clock } from 'lucide-react';

const PersonnelSidePanel = ({ personId, isOpen, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personId || !isOpen) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await personnelService.getPersonnelById(personId);
        setDetail(data);
      } catch (err) {
        console.error("Personnel Detail API Error:", err);
        setError(err.response?.data?.detail || err.message || "Failed to load personnel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [personId, isOpen]);

  if (!isOpen) return null;

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'UNREACHABLE') return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
    if (s === 'IN TRANSIT') return 'bg-blue-100 text-blue-800 border-blue-200 font-semibold';
    if (s === 'ACTIVE') return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-polar-border shadow-2xl z-50 flex flex-col justify-between">
      {/* Panel Header */}
      <div className="p-4 bg-[#0B1F33] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-polar-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Personnel Record Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Detail Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-polar-textMuted gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-polar-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Loading Record...</span>
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
            {/* Person Name & Role Badge */}
            <div className="pb-4 border-b border-polar-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-polar-text leading-tight">
                    {detail.name}
                  </h2>
                  <p className="text-xs text-polar-primary font-semibold mt-0.5">
                    {detail.role}
                  </p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadgeStyle(detail.status)}`}>
                  {detail.status}
                </span>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Department</div>
                  <div className="font-semibold text-polar-text">{detail.department || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Current Location</div>
                  <div className="font-semibold text-polar-text">{detail.current_location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Assigned Expedition</div>
                  <div className="font-semibold text-polar-text">{detail.expedition || 'Unassigned'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Contact Information</div>
                  <div className="font-semibold text-polar-text">{detail.contact || 'N/A'}</div>
                  {detail.emergency_contact && (
                    <div className="text-[11px] text-polar-textMuted mt-0.5">
                      <span className="font-semibold">Emergency:</span> {detail.emergency_contact}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Training & Medical Clearance</div>
                  <div className="font-medium text-polar-text">{detail.training_status || 'N/A'}</div>
                  <div className="text-[11px] text-polar-textMuted mt-0.5">{detail.medical_clearance || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-polar-textMuted uppercase">Last Check-in Information</div>
                  <div className="font-medium text-polar-textMuted italic">
                    Not available
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Panel Footer */}
      <div className="p-3 bg-slate-50 border-t border-polar-border text-[11px] text-polar-textMuted text-center">
        PolarOps ID: #{personId}
      </div>
    </div>
  );
};

export default PersonnelSidePanel;
