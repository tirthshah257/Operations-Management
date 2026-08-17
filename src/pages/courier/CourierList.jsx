import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Drawer from '../../components/common/Drawer';
import Timeline from '../../components/common/Timeline';
import { courierService } from '../../services/courierService';
import { useToast } from '../../context/ToastContext';
import { Truck, Plus, Eye, MapPin } from 'lucide-react';

export default function CourierList() {
  const { courier, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    courierCompany: 'SwiftCourier Logistics',
    receiverName: 'Sneha Kulkarni (BKC Office)',
    type: 'Outward Document',
    dispatchDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    courierCost: 1450
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    courierService.createCourierBooking(formData);
    refreshAllState();
    addToast('Courier booking logged! Auto-recorded in Expenses ledger.', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'AWB / Tracking #',
      key: 'awbNumber',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{row.awbNumber}</span>
          <p className="text-[10px] text-slate-500 font-semibold">{row.courierCompany}</p>
        </div>
      )
    },
    {
      header: 'Recipient',
      key: 'receiverName',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.receiverName}</span>
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.type}</span>
    },
    {
      header: 'Courier Cost',
      key: 'courierCost',
      render: (row) => <span className="font-bold text-emerald-600">₹{(row.courierCost || 0).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Current Status',
      key: 'currentStatus',
      render: (row) => <StatusBadge status={row.currentStatus} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setSelectedCourier(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          Track Timeline
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Courier Booking & AWB Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Parcel dispatch tracking, AWB carrier log & expense auto-linking
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Book Courier Shipment
        </button>
      </div>

      <DataTable columns={columns} data={courier} itemsPerPage={8} />

      {/* Courier Timeline Drawer */}
      {selectedCourier && (
        <Drawer isOpen={!!selectedCourier} onClose={() => setSelectedCourier(null)} title={`Courier Tracking — ${selectedCourier.awbNumber}`} width="max-w-md">
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white">{selectedCourier.courierCompany}</p>
              <p className="text-[10px] text-slate-500 font-mono">AWB: {selectedCourier.awbNumber}</p>
              <p className="mt-1 font-semibold text-blue-600">Recipient: {selectedCourier.receiverName}</p>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white">Transit Timeline History</h4>
            <Timeline events={selectedCourier.timeline || []} />
          </div>
        </Drawer>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Book Courier Parcel Dispatch">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Courier Carrier Agency</label>
            <input
              type="text"
              required
              value={formData.courierCompany}
              onChange={(e) => setFormData({ ...formData, courierCompany: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Receiver Name & Address</label>
            <input
              type="text"
              required
              value={formData.receiverName}
              onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Dispatch Type</label>
              <input
                type="text"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Courier Cost (₹)</label>
              <input
                type="number"
                required
                value={formData.courierCost}
                onChange={(e) => setFormData({ ...formData, courierCost: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Confirm Booking</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
