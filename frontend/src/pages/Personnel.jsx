import React, { useState, useEffect } from 'react';
import { personnelService } from '../services/personnelService';
import { dashboardService } from '../services/dashboardService';
import PersonnelFilters from '../components/personnel/PersonnelFilters';
import PersonnelTable from '../components/personnel/PersonnelTable';
import PersonnelSidePanel from '../components/personnel/PersonnelSidePanel';
import { Users, RefreshCw, AlertCircle } from 'lucide-react';

const Personnel = () => {
  const [personnel, setPersonnel] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    expedition_id: '',
    location: '',
    status: '',
  });

  // Detail panel state
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Fetch Expeditions for filter dropdown
  useEffect(() => {
    const fetchExpeditions = async () => {
      try {
        const data = await dashboardService.getExpeditions();
        setExpeditions(data);
      } catch (err) {
        console.error("Failed to load expeditions list for filter:", err);
      }
    };
    fetchExpeditions();
  }, []);

  // Fetch Personnel with active filters
  const fetchPersonnel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await personnelService.getPersonnel(filters);
      setPersonnel(data);
    } catch (err) {
      console.error("Personnel API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load personnel records from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      expedition_id: '',
      location: '',
      status: '',
    });
  };

  const handleRowClick = (personId) => {
    setSelectedPersonId(personId);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedPersonId(null);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <Users className="w-5 h-5 text-polar-primary" />
            <h1 className="text-lg font-bold uppercase tracking-wider">Personnel Directory</h1>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Operational personnel registry across Maitri, Bharati, Himadri, and active field camps.
          </p>
        </div>
        <button
          onClick={fetchPersonnel}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-polar-text border border-polar-border shadow-sm transition-colors"
          title="Refresh Personnel Directory"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <PersonnelFilters
        filters={filters}
        expeditions={expeditions}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-polar-border shadow-sm">
          <RefreshCw className="w-8 h-8 text-polar-primary animate-spin mb-3" />
          <div className="text-xs uppercase font-bold tracking-wider text-polar-textMuted">
            Fetching Personnel Data...
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 shadow-sm max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Personnel Data Fetch Error</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{error}</p>
              <button
                onClick={fetchPersonnel}
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetching
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Personnel Table */
        <div>
          <div className="flex items-center justify-between mb-2 px-1 text-xs text-polar-textMuted">
            <span>Showing <strong className="text-polar-text">{personnel.length}</strong> personnel records</span>
            <span className="italic text-[11px]">Click any row to inspect details</span>
          </div>

          <PersonnelTable
            personnel={personnel}
            onRowClick={handleRowClick}
            selectedPersonId={selectedPersonId}
          />
        </div>
      )}

      {/* Detail Side Panel */}
      <PersonnelSidePanel
        personId={selectedPersonId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default Personnel;
