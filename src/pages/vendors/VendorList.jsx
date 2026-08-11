import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Drawer from '../../components/common/Drawer';
import { vendorService } from '../../services/vendorService';
import { useToast } from '../../context/ToastContext';
import { Store, Plus, Eye, Phone, Mail, FileCheck2, Receipt } from 'lucide-react';

export default function VendorList() {
  const { vendors, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSummary, setVendorSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Apex Network Hardware Pvt Ltd',
    code: 'ANH-08',
    vendorType: 'Hardware & Network',
    contactPerson: 'Karan Shah',
    email: 'contact@apexnetwork.in',
    phone: '+91 98980 11223',
    address: 'Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    gstNumber: '24AAAAA9999A1Z1',
    category: 'Switches & Routers'
  });

  const handleOpenDetail = (vendor) => {
    setSelectedVendor(vendor);
    const summary = vendorService.getVendorRelatedSummary(vendor.id);
    setVendorSummary(summary);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    vendorService.createVendor(formData);
    refreshAllState();
    addToast('Vendor registered successfully!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Vendor Name & Code',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px]">{row.code}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
        </div>
      )
    },
    {
      header: 'Vendor Type',
      key: 'vendorType',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.vendorType}</span>
    },
    {
      header: 'Contact Person & Phone',
      key: 'contactPerson',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{row.contactPerson}</p>
          <p className="text-[10px] text-slate-400 font-mono">{row.phone} • {row.email}</p>
        </div>
      )
    },
    {
      header: 'GST Number',
      key: 'gstNumber',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.gstNumber}</span>
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
        <button
          onClick={() => handleOpenDetail(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          Related Records
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" />
            Centralized Vendor Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supplier & service provider master directory linked across AMC, maintenance, stationery & expenses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Register New Vendor
        </button>
      </div>

      <DataTable columns={columns} data={vendors} itemsPerPage={8} />

      {/* Vendor Related Records Drawer */}
      {selectedVendor && vendorSummary && (
        <Drawer isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)} title={`Vendor Details — ${selectedVendor.name}`} width="max-w-xl">
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white text-base">{selectedVendor.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">Code: {selectedVendor.code} • GST: {selectedVendor.gstNumber}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-500" /> {selectedVendor.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-500" /> {selectedVendor.email}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">Total Recorded Expenses with Vendor:</span>
              <span className="text-lg font-black text-emerald-600">₹{vendorSummary.totalExpenseValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-blue-500" />
                Linked Agreements & AMC Contracts ({vendorSummary.agreements.length})
              </h4>
              <div className="space-y-2">
                {vendorSummary.agreements.map(a => (
                  <div key={a.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{a.title}</p>
                      <p className="text-[10px] text-slate-400">Expires: {a.expiryDate}</p>
                    </div>
                    <span className="font-bold text-emerald-600">₹{a.contractValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Supplier Vendor">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Vendor Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Vendor Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">GST Number</label>
            <input
              type="text"
              required
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Vendor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
