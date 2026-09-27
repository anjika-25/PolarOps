import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, Edit3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const InventoryEditModal = ({ item, isOpen, onClose, onSaveSuccess }) => {
  const [newQuantity, setNewQuantity] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const canEdit = user && ['ADMIN', 'EXPEDITION_MANAGER'].includes(user.role);

  useEffect(() => {
    if (item) {
      setNewQuantity(item.quantity !== undefined ? item.quantity : item.current_stock);
      setError(null);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const qtyNum = parseFloat(newQuantity);

    if (isNaN(qtyNum) || qtyNum < 0) {
      setError("Inventory quantity cannot be negative.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSaveSuccess(item.item_id, qtyNum);
      onClose();
    } catch (err) {
      console.error("Failed to update inventory quantity:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to update quantity on server.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-polar-border shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B1F33] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-polar-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              {canEdit ? "Edit Inventory Stock Quantity" : "View Inventory Stock Details"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-polar-text text-sm">{item.item_name}</div>
            <div className="text-polar-textMuted">
              Location: <span className="font-semibold text-polar-text">{item.location}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px] text-polar-textMuted">
              <span>Minimum Threshold: <strong className="text-slate-800">{item.minimum_threshold} {item.unit}</strong></span>
              <span>Category: <strong className="text-slate-800">{item.category}</strong></span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-polar-text mb-1.5">
              Stock Quantity ({item.unit})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              readOnly={!canEdit}
              disabled={!canEdit}
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder={`Quantity in ${item.unit}`}
              className={`w-full text-sm rounded-md py-2 px-3 focus:outline-none ${
                canEdit
                  ? 'bg-white border border-slate-300 text-polar-text focus:ring-2 focus:ring-polar-primary'
                  : 'bg-slate-100 border border-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            />
            {canEdit ? (
              <p className="text-[11px] text-polar-textMuted mt-1">
                Updating quantity will automatically recalculate derived status (Normal vs Low).
              </p>
            ) : (
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                View-only for your role.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-polar-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              {canEdit ? "Cancel" : "Close"}
            </button>
            {canEdit && (
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F6F95] hover:bg-[#245978] rounded-md shadow-sm transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Stock Quantity</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryEditModal;
