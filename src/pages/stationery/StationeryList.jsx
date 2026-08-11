import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { stationeryService } from '../../services/stationeryService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Package, Plus, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

export default function StationeryList() {
  const { stationery, vendors, departments, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showItemModal, setShowItemModal] = useState(false);
  const [stockInItem, setStockInItem] = useState(null);
  const [stockOutItem, setStockOutItem] = useState(null);

  const [itemFormData, setItemFormData] = useState({
    description: 'A3 White Copier Paper 80 GSM',
    unit: 'Ream',
    openingStock: 50,
    reorderLevel: 15,
    minimumStock: 5,
    unitCost: 450,
    vendorId: 'VND-006'
  });

  const [stockInQty, setStockInQty] = useState(20);
  const [stockInCost, setStockInCost] = useState(450);

  const [stockOutQty, setStockOutQty] = useState(5);
  const [stockOutDeptId, setStockOutDeptId] = useState('DEPT-001');

  const handleCreateItem = (e) => {
    e.preventDefault();
    stationeryService.createItem(itemFormData);
    refreshAllState();
    addToast('Stationery item master added!', 'success');
    setShowItemModal(false);
  };

  const handleStockInSubmit = (e) => {
    e.preventDefault();
    if (!stockInItem) return;
    stationeryService.addStockIn(stockInItem.id, stockInQty, stockInCost, stockInItem.vendorId);
    refreshAllState();
    addToast(`Added +${stockInQty} stock to ${stockInItem.description}! Auto-logged in Expenses.`, 'success');
    setStockInItem(null);
  };

  const handleStockOutSubmit = (e) => {
    e.preventDefault();
    if (!stockOutItem) return;
    stationeryService.addStockOut(stockOutItem.id, stockOutQty, stockOutDeptId, 'Departmental Issue');
    refreshAllState();
    addToast(`Issued -${stockOutQty} stock of ${stockOutItem.description}`, 'info');
    setStockOutItem(null);
  };

  const columns = [
    {
      header: 'Item Code & Description',
      key: 'description',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px]">{row.itemCode}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.description}</p>
        </div>
      )
    },
    {
      header: 'Stock Formula (Opening + In - Out)',
      key: 'currentStock',
      render: (row) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{row.currentStock} {row.unit}s</span>
          <p className="text-[10px] text-slate-400 font-mono">
            {row.openingStock} + {row.stockIn} - {row.stockOut}
          </p>
        </div>
      )
    },
    {
      header: 'Reorder Threshold',
      key: 'reorderLevel',
      render: (row) => <span className="font-semibold text-slate-600 dark:text-slate-400">{row.reorderLevel} {row.unit}s</span>
    },
    {
      header: 'Unit Cost',
      key: 'unitCost',
      render: (row) => <span className="font-bold text-emerald-600">₹{row.unitCost}</span>
    },
    {
      header: 'Stock Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Stock Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setStockInItem(row);
              setStockInCost(row.unitCost);
            }}
            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 rounded text-[11px] font-bold flex items-center gap-1"
          >
            <ArrowUpRight className="w-3 h-3" />
            Stock In
          </button>
          <button
            onClick={() => setStockOutItem(row)}
            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950 dark:hover:bg-amber-900 dark:text-amber-300 rounded text-[11px] font-bold flex items-center gap-1"
          >
            <ArrowDownLeft className="w-3 h-3" />
            Stock Out
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Stationery & Inventory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Item master, Stock In / Stock Out formula, low stock warnings & departmental consumption logs
          </p>
        </div>

        <button
          onClick={() => setShowItemModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Item Master
        </button>
      </div>

      <DataTable columns={columns} data={stationery} itemsPerPage={8} />

      {/* Stock In Modal */}
      {stockInItem && (
        <Modal isOpen={!!stockInItem} onClose={() => setStockInItem(null)} title={`Stock In Entry — ${stockInItem.description}`} maxWidth="max-w-md">
          <form onSubmit={handleStockInSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Add Quantity ({stockInItem.unit}s)</label>
              <input
                type="number"
                required
                min={1}
                value={stockInQty}
                onChange={(e) => setStockInQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Unit Cost (₹)</label>
              <input
                type="number"
                required
                value={stockInCost}
                onChange={(e) => setStockInCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setStockInItem(null)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm">Confirm Stock In</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Out Modal */}
      {stockOutItem && (
        <Modal isOpen={!!stockOutItem} onClose={() => setStockOutItem(null)} title={`Stock Out / Issue — ${stockOutItem.description}`} maxWidth="max-w-md">
          <form onSubmit={handleStockOutSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Issue Quantity ({stockOutItem.unit}s)</label>
              <input
                type="number"
                required
                min={1}
                max={stockOutItem.currentStock}
                value={stockOutQty}
                onChange={(e) => setStockOutQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Issue to Department</label>
              <select
                value={stockOutDeptId}
                onChange={(e) => setStockOutDeptId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setStockOutItem(null)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-bold rounded-lg shadow-sm">Confirm Stock Out</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Item Modal */}
      <Modal isOpen={showItemModal} onClose={() => setShowItemModal(false)} title="Create Stationery Item Master">
        <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Item Description</label>
            <input
              type="text"
              required
              value={itemFormData.description}
              onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Unit</label>
              <input
                type="text"
                required
                value={itemFormData.unit}
                onChange={(e) => setItemFormData({ ...itemFormData, unit: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Opening Stock</label>
              <input
                type="number"
                required
                value={itemFormData.openingStock}
                onChange={(e) => setItemFormData({ ...itemFormData, openingStock: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Reorder Level Alert Threshold</label>
              <input
                type="number"
                required
                value={itemFormData.reorderLevel}
                onChange={(e) => setItemFormData({ ...itemFormData, reorderLevel: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-amber-600"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Unit Cost (₹)</label>
              <input
                type="number"
                required
                value={itemFormData.unitCost}
                onChange={(e) => setItemFormData({ ...itemFormData, unitCost: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowItemModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
