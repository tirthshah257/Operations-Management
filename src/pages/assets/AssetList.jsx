import React, { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import QrBarcodeModal from '../../components/common/QrBarcodeModal';
import AssetBulkUploadModal from './AssetBulkUploadModal';
import AssetAudit from './AssetAudit';
import { assetService } from '../../services/assetService';
import { entityResolver } from '../../utils/entityResolver';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';
import { Laptop, Plus, QrCode, UploadCloud, ShieldCheck, Download, ArrowRightLeft } from 'lucide-react';

export default function AssetList() {
  const { assets, vendors, departments, locations, users, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('INVENTORY'); // INVENTORY vs AUDIT
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedQrAsset, setSelectedQrAsset] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [transferAsset, setTransferAsset] = useState(null);

  const [transferFormData, setTransferFormData] = useState({
    currentUserId: '',
    departmentId: '',
    locationId: '',
    reason: ''
  });

  const [registerFormData, setRegisterFormData] = useState({
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'Apple',
    model: 'MacBook Pro M3',
    serialNumber: '',
    purchaseCost: 150000,
    vendorId: 'VND-001',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    specifications: ''
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchSearch =
        a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'ALL' || a.assetType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [assets, searchQuery, typeFilter, statusFilter]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    assetService.createAsset(registerFormData);
    refreshAllState();
    addToast('Asset registered successfully!', 'success');
    setShowRegisterModal(false);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferAsset) return;
    assetService.transferAsset(transferAsset.id, transferFormData);
    refreshAllState();
    addToast(`Asset ${transferAsset.assetId} transfer completed!`, 'success');
    setTransferAsset(null);
  };

  const handleExportExcel = () => {
    const data = filteredAssets.map(a => ({
      'Asset ID': a.assetId,
      'Type': a.assetType,
      'Make': a.make,
      'Model': a.model,
      'Serial Number': a.serialNumber,
      'Status': a.status,
      'User': entityResolver.getUserName(a.currentUserId),
      'Department': entityResolver.getDepartmentName(a.departmentId),
      'Location': entityResolver.getLocationName(a.locationId),
      'Cost': a.purchaseCost
    }));
    exportToExcel(data, 'it_assets_inventory.xlsx', 'Assets');
  };

  const columns = [
    {
      header: 'Asset Tag',
      key: 'assetId',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{row.assetId}</span>
          <p className="text-[10px] text-slate-400 font-mono">S/N: {row.serialNumber}</p>
        </div>
      )
    },
    {
      header: 'Make & Model',
      key: 'model',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.make} {row.model}</p>
          <p className="text-[10px] text-slate-500">{row.assetType} • {row.category}</p>
        </div>
      )
    },
    {
      header: 'Current User',
      key: 'currentUserId',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">{entityResolver.getUserName(row.currentUserId)}</span>
      )
    },
    {
      header: 'Department & Location',
      key: 'departmentId',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getDepartmentName(row.departmentId)}</p>
          <p className="text-[10px] text-slate-400">{entityResolver.getLocationName(row.locationId)}</p>
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedQrAsset(row)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
            title="View QR Label"
          >
            <QrCode className="w-3.5 h-3.5" />
            Tag
          </button>
          <button
            onClick={() => {
              setTransferAsset(row);
              setTransferFormData({
                currentUserId: row.currentUserId || '',
                departmentId: row.departmentId || '',
                locationId: row.locationId || '',
                reason: 'Standard re-allocation'
              });
            }}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            title="Transfer / Allocate"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Transfer
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-6 h-6 text-blue-600" />
            IT Asset Management & Lifecycle
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hardware, software, network equipment registration, allocation, transfer & QR audit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            Bulk CSV Upload
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Register Asset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'INVENTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Asset Inventory
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'AUDIT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Physical Audit Mode
        </button>
      </div>

      {activeTab === 'AUDIT' ? (
        <AssetAudit />
      ) : (
        <>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search asset tag, make, model, serial..." />

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="ALL">All Types</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Peripheral">Peripheral</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="ALL">All Statuses</option>
                <option value="In Use">In Use</option>
                <option value="In Stock">In Stock</option>
                <option value="Under Repair">Under Repair</option>
              </select>

              <button
                onClick={handleExportExcel}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Export Excel
              </button>
            </div>
          </div>

          <DataTable columns={columns} data={filteredAssets} itemsPerPage={8} />
        </>
      )}

      {/* QR Code Modal */}
      <QrBarcodeModal isOpen={!!selectedQrAsset} onClose={() => setSelectedQrAsset(null)} asset={selectedQrAsset} />

      {/* Bulk Upload Modal */}
      <AssetBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />

      {/* Register Asset Modal */}
      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} title="Register New IT Asset" maxWidth="max-w-xl">
        <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Asset Type</label>
              <select
                value={registerFormData.assetType}
                onChange={(e) => setRegisterFormData({ ...registerFormData, assetType: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Peripheral">Peripheral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                required
                value={registerFormData.category}
                onChange={(e) => setRegisterFormData({ ...registerFormData, category: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Make / Brand</label>
              <input
                type="text"
                required
                value={registerFormData.make}
                onChange={(e) => setRegisterFormData({ ...registerFormData, make: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Model Name</label>
              <input
                type="text"
                required
                value={registerFormData.model}
                onChange={(e) => setRegisterFormData({ ...registerFormData, model: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Serial Number</label>
              <input
                type="text"
                required
                placeholder="C02G1234..."
                value={registerFormData.serialNumber}
                onChange={(e) => setRegisterFormData({ ...registerFormData, serialNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Purchase Cost (₹)</label>
              <input
                type="number"
                required
                value={registerFormData.purchaseCost}
                onChange={(e) => setRegisterFormData({ ...registerFormData, purchaseCost: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Vendor</label>
              <select
                value={registerFormData.vendorId}
                onChange={(e) => setRegisterFormData({ ...registerFormData, vendorId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Department</label>
              <select
                value={registerFormData.departmentId}
                onChange={(e) => setRegisterFormData({ ...registerFormData, departmentId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Location</label>
              <select
                value={registerFormData.locationId}
                onChange={(e) => setRegisterFormData({ ...registerFormData, locationId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">
              Save & Register Asset
            </button>
          </div>
        </form>
      </Modal>

      {/* Asset Transfer Modal */}
      {transferAsset && (
        <Modal isOpen={!!transferAsset} onClose={() => setTransferAsset(null)} title={`Transfer Asset — ${transferAsset.assetId}`} maxWidth="max-w-md">
          <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Assign User</label>
              <select
                value={transferFormData.currentUserId}
                onChange={(e) => setTransferFormData({ ...transferFormData, currentUserId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="">Unassigned (In Stock)</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Department</label>
                <select
                  value={transferFormData.departmentId}
                  onChange={(e) => setTransferFormData({ ...transferFormData, departmentId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <select
                  value={transferFormData.locationId}
                  onChange={(e) => setTransferFormData({ ...transferFormData, locationId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Transfer Reason / Notes</label>
              <textarea
                rows={2}
                value={transferFormData.reason}
                onChange={(e) => setTransferFormData({ ...transferFormData, reason: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setTransferAsset(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">
                Confirm Transfer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
