import React, { useState, useEffect } from 'react';
import { emergencyService } from '../services/emergencyService';
import DeclareEmergencyModal from '../components/emergency/DeclareEmergencyModal';
import ActiveIncidentCard from '../components/emergency/ActiveIncidentCard';
import RecentIncidentsList from '../components/emergency/RecentIncidentsList';
import { AlertTriangle, RefreshCw, AlertCircle, ShieldAlert, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Emergency = () => {
  const [incidents, setIncidents] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const canDeclareEmergency = user && ['ADMIN', 'EMERGENCY_COORDINATOR'].includes(user.role);

  // Modal & submission state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Resolve state
  const [resolving, setResolving] = useState(false);

  // Toast banner for feedback
  const [toastMessage, setToastMessage] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emergencyService.getIncidents();
      setIncidents(data);

      if (data && data.length > 0) {
        // Find active incident if any exists
        const active = data.find((i) => (i.status || '').toUpperCase() === 'ACTIVE');
        setActiveIncident(active || null);
      } else {
        setActiveIncident(null);
      }
    } catch (err) {
      console.error("Emergency API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load emergency records from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleOpenModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setIsModalOpen(false);
      setSubmitError(null);
    }
  };

  const handleDeclareEmergency = async (formData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const newIncident = await emergencyService.declareEmergency(formData);
      setIsModalOpen(false);
      
      // Update state with newly created emergency incident
      setActiveIncident(newIncident);
      setIncidents((prev) => [newIncident, ...prev]);

      // Show success toast feedback
      setToastMessage(`Emergency Incident #${newIncident.incident_id} successfully declared.`);
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err) {
      console.error("Declare Emergency API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to declare emergency incident.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveIncident = async (incidentId) => {
    setResolving(true);
    try {
      await emergencyService.resolveIncident(incidentId);
      setToastMessage(`Emergency Incident #${incidentId} successfully marked as resolved.`);
      setTimeout(() => setToastMessage(null), 6000);
      await fetchIncidents();
    } catch (err) {
      console.error("Resolve Emergency API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to resolve emergency incident.";
      setToastMessage(`Error: ${msg}`);
      setTimeout(() => setToastMessage(null), 6000);
    } finally {
      setResolving(false);
    }
  };

  const handleSelectIncidentFromList = (incident) => {
    setActiveIncident(incident);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="space-y-6 pb-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h1 className="text-lg font-bold uppercase tracking-wider">Emergency Response Command</h1>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Rapid incident reporting, emergency resource allocation, and evacuation checklist tracking for polar stations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={fetchIncidents}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded bg-white hover:bg-slate-50 text-polar-text border border-polar-border shadow-sm transition-colors"
            title="Refresh Emergency Incidents"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {canDeclareEmergency ? (
            <button
              onClick={handleOpenModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded bg-rose-700 hover:bg-rose-800 text-white shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Declare Emergency</span>
            </button>
          ) : (
            <div className="text-[11px] text-amber-800 font-semibold px-3 py-1.5 bg-amber-50 border border-amber-200 rounded">
              Only Emergency Coordinators and Admins can declare an emergency.
            </div>
          )}
        </div>
      </div>

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-polar-border shadow-sm">
          <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mb-3" />
          <div className="text-xs uppercase font-bold tracking-wider text-polar-textMuted">
            Fetching Emergency Records...
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 shadow-sm max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Emergency Data Fetch Error</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{error}</p>
              <button
                onClick={fetchIncidents}
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetching
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {!activeIncident ? (
            /* Section 1: Institutional Empty State (No Active Emergencies) */
            <div className="bg-white rounded-lg border border-polar-border p-12 shadow-sm text-center">
              <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
                <div className="p-4 bg-emerald-50 rounded-full border border-emerald-200">
                  <ShieldAlert className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-polar-text">
                    No Active Emergency Incidents
                  </h2>
                  <p className="text-xs text-polar-textMuted mt-1.5 leading-relaxed">
                    There are currently no active emergency incidents reported across Maitri, Bharati, Himadri, or active field camps. All stations are operating under normal conditions.
                  </p>
                </div>
                {canDeclareEmergency ? (
                  <button
                    onClick={handleOpenModal}
                    className="mt-2 inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded bg-rose-700 hover:bg-rose-800 text-white shadow-sm transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Declare Emergency</span>
                  </button>
                ) : (
                  <div className="mt-2 text-xs text-amber-800 font-semibold px-4 py-2 bg-amber-50 border border-amber-200 rounded text-center">
                    Only Emergency Coordinators and Admins can declare an emergency.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Section 2: Active Emergency Display */
            <ActiveIncidentCard
              incident={activeIncident}
              onResolve={handleResolveIncident}
              resolving={resolving}
              canResolve={canDeclareEmergency}
            />
          )}

          {/* Section 3: Recent Incidents Log List */}
          <RecentIncidentsList
            incidents={incidents}
            onSelectIncident={handleSelectIncidentFromList}
            currentIncidentId={activeIncident?.incident_id}
          />
        </div>
      )}


      {/* Declare Emergency Form Modal */}
      <DeclareEmergencyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleDeclareEmergency}
        submitting={submitting}
        submitError={submitError}
      />
    </div>
  );
};

export default Emergency;
