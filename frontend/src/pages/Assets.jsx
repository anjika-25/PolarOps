import React, { useState, useEffect } from 'react';
import { assetService } from '../services/assetService';
import AssetFilters from '../components/assets/AssetFilters';
import AssetTable from '../components/assets/AssetTable';
import AssetSidePanel from '../components/assets/AssetSidePanel';
import { HardDrive, RefreshCw, AlertCircle } from 'lucide-react';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    condition: '',
    maintenance_status: '',
  });

  // Detail panel state
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Fetch Assets with active filters
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getAssets(filters);
      setAssets(data);
    } catch (err) {
      console.error("Assets API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load asset records from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      condition: '',
      maintenance_status: '',
    });
  };

  const handleRowClick = (assetId) => {
    setSelectedAssetId(assetId);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAssetId(null);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <HardDrive className="w-5 h-5 text-polar-primary" />
            <h1 className="text-lg font-bold uppercase tracking-wider">Asset & Equipment Register</h1>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Operational equipment tracking, condition monitoring, and maintenance status across polar stations.
          </p>
        </div>
        <button
          onClick={fetchAssets}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-polar-text border border-polar-border shadow-sm transition-colors"
          title="Refresh Assets Register"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Register</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <AssetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-polar-border shadow-sm">
          <RefreshCw className="w-8 h-8 text-polar-primary animate-spin mb-3" />
          <div className="text-xs uppercase font-bold tracking-wider text-polar-textMuted">
            Fetching Asset Records...
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 shadow-sm max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Asset Data Fetch Error</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{error}</p>
              <button
                onClick={fetchAssets}
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Fetching
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Asset Table */
        <div>
          <div className="flex items-center justify-between mb-2 px-1 text-xs text-polar-textMuted">
            <span>Showing <strong className="text-polar-text">{assets.length}</strong> asset records</span>
            <span className="italic text-[11px]">Click any row to inspect complete asset details</span>
          </div>

          <AssetTable
            assets={assets}
            onRowClick={handleRowClick}
            selectedAssetId={selectedAssetId}
          />
        </div>
      )}

      {/* Detail Side Panel */}
      <AssetSidePanel
        assetId={selectedAssetId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default Assets;
