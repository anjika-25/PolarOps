import React, { useState, useEffect, useRef } from 'react';
import { logisticsService } from '../services/logisticsService';
import { dashboardService } from '../services/dashboardService';
import CargoTable from '../components/logistics/CargoTable';
import InventoryTable from '../components/logistics/InventoryTable';
import InventoryEditModal from '../components/logistics/InventoryEditModal';
import LowStockAlertBanner from '../components/logistics/LowStockAlertBanner';
import InventoryPredictionPanel from '../components/logistics/InventoryPredictionPanel';
import { Package, CheckCircle2, RefreshCw } from 'lucide-react';

const Logistics = () => {
  const [activeTab, setActiveTab] = useState('cargo'); // 'cargo' | 'inventory'

  // Ref for auto-scrolling to prediction panel
  const predictionPanelRef = useRef(null);

  // Cargo state
  const [cargo, setCargo] = useState([]);
  const [cargoFilters, setCargoFilters] = useState({ status: '', priority: '', destination: '' });
  const [cargoLoading, setCargoLoading] = useState(true);
  const [cargoError, setCargoError] = useState(null);

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [inventoryFilters, setInventoryFilters] = useState({ location: '', status: '' });
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);

  // Prediction state
  const [selectedPredictionItemId, setSelectedPredictionItemId] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  // Dashboard alerts state for real-time low-stock alerts
  const [dashboardAlerts, setDashboardAlerts] = useState([]);

  // Edit Modal & Notification Feedback state
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Fetch Cargo
  const fetchCargo = async () => {
    setCargoLoading(true);
    setCargoError(null);
    try {
      const data = await logisticsService.getCargo(cargoFilters);
      setCargo(data);
    } catch (err) {
      console.error("Cargo API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load cargo records.";
      setCargoError(msg);
    } finally {
      setCargoLoading(false);
    }
  };

  // Fetch Inventory
  const fetchInventory = async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const data = await logisticsService.getInventory(inventoryFilters);
      setInventory(data);

      // Auto-select Item #29 (Jet A-1 Fuel) if prediction item is not yet selected
      if (!selectedPredictionItemId && data && data.length > 0) {
        const defaultItem = data.find((i) => i.item_id === 29) || data[0];
        if (defaultItem) {
          setSelectedPredictionItemId(defaultItem.item_id);
        }
      }
    } catch (err) {
      console.error("Inventory API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load inventory stock.";
      setInventoryError(msg);
    } finally {
      setInventoryLoading(false);
    }
  };

  // Fetch Prediction for selected item
  const fetchPrediction = async (itemId) => {
    if (!itemId) {
      setPredictionData(null);
      return;
    }
    setPredictionLoading(true);
    setPredictionError(null);
    try {
      const data = await logisticsService.getInventoryPrediction(itemId);
      setPredictionData(data);
    } catch (err) {
      console.error("Prediction API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load depletion prediction.";
      setPredictionError(msg);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Fetch Dashboard Alerts & Stats for real-time sync
  const fetchDashboardAlerts = async () => {
    try {
      const alerts = await dashboardService.getAlerts();
      setDashboardAlerts(alerts);
      await dashboardService.getStats();
    } catch (err) {
      console.error("Failed to fetch dashboard alerts for logistics:", err);
    }
  };

  // Initial mount fetch to ensure count initializes cleanly without temporary 0
  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (activeTab === 'cargo') {
      fetchCargo();
    }
  }, [cargoFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
      fetchDashboardAlerts();
    }
  }, [inventoryFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 'inventory' && selectedPredictionItemId) {
      fetchPrediction(selectedPredictionItemId);
    }
  }, [selectedPredictionItemId, activeTab]);

  // Cargo Filters Handlers
  const handleCargoFilterChange = (key, value) => {
    setCargoFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleResetCargoFilters = () => {
    setCargoFilters({ status: '', priority: '', destination: '' });
  };

  // Inventory Filters Handlers
  const handleInventoryFilterChange = (key, value) => {
    setInventoryFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleResetInventoryFilters = () => {
    setInventoryFilters({ location: '', status: '' });
  };

  // Select Item for Prediction & Smooth Auto-Scroll to Prediction Graph
  const handleSelectPredictionItem = (itemId) => {
    const id = Number(itemId);
    setSelectedPredictionItemId(id);
    setTimeout(() => {
      predictionPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Inventory Edit Action
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveInventoryQuantity = async (itemId, newQuantity) => {
    // 1. Call PATCH /api/inventory/{item_id}
    const updatedRecord = await logisticsService.updateInventoryQuantity(itemId, newQuantity);

    // 2. Update local inventory state immediately
    setInventory((prev) =>
      prev.map((item) => (item.item_id === itemId ? updatedRecord : item))
    );

    // 3. Show feedback banner
    setFeedbackMessage(
      `Updated ${updatedRecord.item_name} stock quantity to ${updatedRecord.quantity} ${updatedRecord.unit} (Status: ${updatedRecord.status})`
    );
    setTimeout(() => setFeedbackMessage(null), 5000);

    // 4. Refetch inventory, dashboard alerts, and prediction if the edited item is currently selected
    await Promise.all([
      fetchInventory(),
      fetchDashboardAlerts(),
      selectedPredictionItemId === itemId ? fetchPrediction(itemId) : Promise.resolve()
    ]);
  };

  const handleRefreshAll = () => {
    if (activeTab === 'cargo') {
      fetchCargo();
    } else {
      fetchInventory();
      fetchDashboardAlerts();
      if (selectedPredictionItemId) {
        fetchPrediction(selectedPredictionItemId);
      }
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F33]">
            <Package className="w-5 h-5 text-polar-primary" />
            <h1 className="text-lg font-bold uppercase tracking-wider">Cargo & Inventory Logistics</h1>
          </div>
          <p className="text-xs text-polar-textMuted mt-0.5">
            Polar expedition cargo transit tracking and station inventory stock management.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-polar-text border border-polar-border shadow-sm transition-colors"
          title="Refresh Module Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Success Feedback Banner */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Institutional Tab Navigation */}
      <div className="border-b border-polar-border flex items-center gap-2">
        <button
          onClick={() => setActiveTab('cargo')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'cargo'
              ? 'border-polar-primary text-polar-primary bg-white'
              : 'border-transparent text-polar-textMuted hover:text-polar-text hover:bg-slate-100/60'
          }`}
        >
          Cargo Transits ({cargoLoading && cargo.length === 0 ? '...' : cargo.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-polar-primary text-polar-primary bg-white'
              : 'border-transparent text-polar-textMuted hover:text-polar-text hover:bg-slate-100/60'
          }`}
        >
          Station Inventory ({inventoryLoading && inventory.length === 0 ? '...' : inventory.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cargo' ? (
        <CargoTable
          cargo={cargo}
          filters={cargoFilters}
          onFilterChange={handleCargoFilterChange}
          onResetFilters={handleResetCargoFilters}
          loading={cargoLoading}
          error={cargoError}
          onRetry={fetchCargo}
        />
      ) : (
        <div className="space-y-6">
          {/* Active Low-Stock Alert Banner (from actual GET /api/dashboard/alerts) */}
          <LowStockAlertBanner alerts={dashboardAlerts} />

          {/* Section 1: Depletion Prediction Panel with Auto-Scroll Ref Anchor */}
          <div ref={predictionPanelRef} className="scroll-mt-4">
            <InventoryPredictionPanel
              inventoryItems={inventory}
              selectedItemId={selectedPredictionItemId}
              onSelectItem={handleSelectPredictionItem}
              predictionData={predictionData}
              loading={predictionLoading}
              error={predictionError}
              onRetry={() => fetchPrediction(selectedPredictionItemId)}
            />
          </div>

          {/* Section 2: Inventory Stock Table */}
          <InventoryTable
            inventory={inventory}
            filters={inventoryFilters}
            onFilterChange={handleInventoryFilterChange}
            onResetFilters={handleResetInventoryFilters}
            onEditClick={handleOpenEditModal}
            onSelectPredictionItem={handleSelectPredictionItem}
            selectedPredictionItemId={selectedPredictionItemId}
            loading={inventoryLoading}
            error={inventoryError}
            onRetry={fetchInventory}
          />
        </div>
      )}

      {/* Inventory Edit Modal */}
      <InventoryEditModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSaveSuccess={handleSaveInventoryQuantity}
      />
    </div>
  );
};

export default Logistics;
