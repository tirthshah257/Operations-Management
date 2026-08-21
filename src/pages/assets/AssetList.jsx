import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import QrBarcodeModal from '../../components/common/QrBarcodeModal';
import AssetBulkUploadModal from './AssetBulkUploadModal';
import AssetAudit from './AssetAudit';
import AllocateAssetModal from '../../components/assets/AllocateAssetModal';
import ReallocateAssetModal from '../../components/assets/ReallocateAssetModal';
import AssetHistoryDrawer from '../../components/assets/AssetHistoryDrawer';
import { assetService } from '../../services/assetService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Laptop, Plus, QrCode, Upload, CheckSquare, UserCheck, ArrowRightLeft, History } from 'lucide-react';

export default function AssetList() {
  const { assets, users, locations, departments, vendors, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('LIST');
  const [allocateModalAsset, setAllocateModalAsset] = useState(null);
  const [reallocateModalAsset, setReallocateModalAsset] = useState(null);
  const [historyDrawerAsset, setHistoryDrawerAsset] = useState(null);
  const [qrModalAsset, setQrModalAsset] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    assetId: 'AST-2099',
    assetName: 'Dell Latitude 7440 Ultrabook',
    category: 'Hardware',
    assetType: 'Laptop',
    make: 'Dell',
    model: 'Latitude 7440',
    serialNumber: 'SN-DELL-998877',
    purchaseDate: '2026-05-10',
    warrantyExpiry: '2029-05-09',
    purchaseCost: 88000,
    vendorId: 'VND-001',
    locationId: 'LOC-005', // Aslali Factory
    departmentId: 'DEPT-001',
    currentUserId: null,
    status: 'Available'
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
      header: 'Asset ID',
      key: 'assetId',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{row.assetId}</span>
          <p className="text-[10px] text-slate-500 font-semibold">{row.assetType || row.category}</p>
        </div>
      )
    },
    {
      header: 'Asset Name & Serial',
      key: 'model',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.assetName || `${row.make} ${row.model}`}</p>
          <p className="text-[10px] text-slate-400 font-mono">S/N: {row.serialNumber}</p>
        </div>
      )
    },
    {
      header: 'Factory / Location',
      key: 'locationId',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.locationName || entityResolver.getLocationName(row.locationId)}
        </span>
      )
    },
    {
      header: 'Assigned User',
      key: 'currentUserId',
      render: (row) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {row.currentUserName || (row.currentUserId ? entityResolver.getUserName(row.currentUserId) : 'Unassigned')}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status === 'In Use' ? 'Allocated' : (row.status === 'In Stock' ? 'Available' : row.status)} />
    },
    {
      header: 'Allocation Date',
      key: 'allocationDate',
      render: (row) => (
        <span className="text-slate-500 font-mono text-[11px]">
          {row.allocationDate || '—'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => {
        const isAllocated = row.status === 'Allocated' || row.status === 'In Use' || !!row.currentUserId;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {!isAllocated ? (
              <button
                onClick={() => setAllocateModalAsset(row)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors"
                title="Allocate Asset to User"
              >
                <UserCheck className="w-3 h-3" />
                Allocate
              </button>
            ) : (
              <button
                onClick={() => setReallocateModalAsset(row)}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors"
                title="Reallocate Asset to New User"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Reallocate
              </button>
            )}

            <button
              onClick={() => setHistoryDrawerAsset(row)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
              title="View Allocation History"
            >
              <History className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            <button
              onClick={() => setQrModalAsset(row)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
              title="Print QR / Barcode Tag"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Asset Allocation & Reallocation Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track asset allocations, factory transfers (Aslali & Radhu), reallocation history & QR barcode labels
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

      {/* Allocate Asset Modal */}
      {allocateModalAsset && (
        <AllocateAssetModal
          isOpen={!!allocateModalAsset}
          onClose={() => {
            setAllocateModalAsset(null);
            refreshAllState();
          }}
          asset={allocateModalAsset}
        />
      )}

      {/* Reallocate Asset Modal */}
      {reallocateModalAsset && (
        <ReallocateAssetModal
          isOpen={!!reallocateModalAsset}
          onClose={() => {
            setReallocateModalAsset(null);
            refreshAllState();
          }}
          asset={reallocateModalAsset}
        />
      )}

      {/* Allocation History Drawer */}
      {historyDrawerAsset && (
        <AssetHistoryDrawer
          isOpen={!!historyDrawerAsset}
          onClose={() => {
            setHistoryDrawerAsset(null);
            refreshAllState();
          }}
          asset={historyDrawerAsset}
        />
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
              <label className="block font-semibold mb-1">Asset Name</label>
              <input
                type="text"
                required
                value={formData.assetName}
                onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Make / Model</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Factory / Location</label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              >
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
              </select>
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
