import React, { useState, useEffect } from 'react';
import { logisticsService } from '../services/logisticsService';
import CargoTable from '../components/logistics/CargoTable';
import InventoryTable from '../components/logistics/InventoryTable';
import InventoryEditModal from '../components/logistics/InventoryEditModal';
import { Package, CheckCircle2, RefreshCw } from 'lucide-react';

const Logistics = () => {
  const [activeTab, setActiveTab] = useState('cargo'); // 'cargo' | 'inventory'

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
    } catch (err) {
      console.error("Inventory API Error:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to load inventory stock.";
      setInventoryError(msg);
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'cargo') {
      fetchCargo();
    }
  }, [cargoFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
    }
  }, [inventoryFilters, activeTab]);

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

  // Inventory Edit Action
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveInventoryQuantity = async (itemId, newQuantity) => {
    const updatedRecord = await logisticsService.updateInventoryQuantity(itemId, newQuantity);
    
    // Update local state and refetch
    setInventory((prev) =>
      prev.map((item) => (item.item_id === itemId ? updatedRecord : item))
    );

    // Show temporary feedback banner
    setFeedbackMessage(`Updated ${updatedRecord.item_name} stock quantity to ${updatedRecord.quantity} ${updatedRecord.unit} (Status: ${updatedRecord.status})`);
    setTimeout(() => setFeedbackMessage(null), 5000);

    // Refetch to ensure sync with PostgreSQL
    fetchInventory();
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
          onClick={activeTab === 'cargo' ? fetchCargo : fetchInventory}
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
          Cargo Transits ({cargo.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-polar-primary text-polar-primary bg-white'
              : 'border-transparent text-polar-textMuted hover:text-polar-text hover:bg-slate-100/60'
          }`}
        >
          Station Inventory ({inventory.length})
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
        <InventoryTable
          inventory={inventory}
          filters={inventoryFilters}
          onFilterChange={handleInventoryFilterChange}
          onResetFilters={handleResetInventoryFilters}
          onEditClick={handleOpenEditModal}
          loading={inventoryLoading}
          error={inventoryError}
          onRetry={fetchInventory}
        />
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
