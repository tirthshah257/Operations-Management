import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import QrBarcodeModal from '../../components/common/QrBarcodeModal';
import AssetBulkUploadModal from './AssetBulkUploadModal';
import AssetAudit from './AssetAudit';
import { assetService } from '../../services/assetService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Laptop, Plus, QrCode, Upload, CheckSquare, Eye } from 'lucide-react';

export default function AssetList() {
  const { assets, users, locations, departments, vendors, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('LIST');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [qrModalAsset, setQrModalAsset] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    assetId: 'AST-2099',
    category: 'Hardware',
    assetType: 'Laptop',
    make: 'Dell',
    model: 'Latitude 7430',
    serialNumber: 'SN-DELL-998877',
    purchaseDate: '2026-05-10',
    warrantyExpiry: '2029-05-09',
    purchaseCost: 88000,
    vendorId: 'VND-001',
    locationId: 'LOC-001',
    departmentId: 'DEPT-001',
    currentUserId: 'USR-001',
    status: 'In Use'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    assetService.createAsset(formData);
    refreshAllState();
    addToast('IT Asset registered successfully!', 'success');
    setShowCreateModal(false);
  };

  const columns = [
    {
      header: 'Asset Tag',
      key: 'assetId',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{row.assetId}</span>
          <p className="text-[10px] text-slate-500 font-semibold">{row.assetType}</p>
        </div>
      )
    },
    {
      header: 'Make & Model',
      key: 'model',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.make} {row.model}</p>
          <p className="text-[10px] text-slate-400 font-mono">S/N: {row.serialNumber}</p>
        </div>
      )
    },
    {
      header: 'Assigned User',
      key: 'currentUserId',
      render: (row) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {entityResolver.getUserName(row.currentUserId)}
        </span>
      )
    },
    {
      header: 'Location & Dept',
      key: 'locationId',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{entityResolver.getLocationName(row.locationId)}</p>
          <p className="text-[10px] text-slate-400">{entityResolver.getDepartmentName(row.departmentId)}</p>
        </div>
      )
    },
    {
      header: 'Purchase Cost',
      key: 'purchaseCost',
      render: (row) => <span className="font-bold text-emerald-600">₹{(row.purchaseCost || 0).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setQrModalAsset(row)}
            className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold"
            title="Print QR / Barcode Tag"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            IT Asset Management & Lifecycle
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Asset registration, physical audit mode, QR label tags & bulk CSV parser
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab(activeTab === 'LIST' ? 'AUDIT' : 'LIST')}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>{activeTab === 'LIST' ? 'Physical Audit Mode' : 'View Asset Inventory'}</span>
          </button>

          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Bulk CSV Upload</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <DataTable columns={columns} data={assets} itemsPerPage={8} />
      ) : (
        <AssetAudit />
      )}

      {/* QR Barcode Modal */}
      {qrModalAsset && (
        <QrBarcodeModal isOpen={!!qrModalAsset} onClose={() => setQrModalAsset(null)} asset={qrModalAsset} />
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <AssetBulkUploadModal isOpen={showBulkUploadModal} onClose={() => { setShowBulkUploadModal(false); refreshAllState(); }} />
      )}

      {/* Create Asset Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Register IT Asset">
        <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Asset Tag ID</label>
              <input
                type="text"
                required
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Make / Brand</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Model Name</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Serial Number</label>
              <input
                type="text"
                required
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Asset</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
