import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { locationService } from '../../services/locationService';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus } from 'lucide-react';

export default function LocationList() {
  const { locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Innovation Hub (Pune)',
    code: 'PUN-HUB',
    address: 'Viman Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    contactPerson: 'Rahul Deshmukh'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    locationService.createLocation(formData);
    refreshAllState();
    addToast('Office location registered!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Location & Code',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px]">{row.code}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
        </div>
      )
    },
    {
      header: 'Address & City',
      key: 'city',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{row.city}, {row.state}</p>
          <p className="text-[10px] text-slate-400">{row.address}</p>
        </div>
      )
    },
    {
      header: 'Contact Person',
      key: 'contactPerson',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.contactPerson}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Master Office Locations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered corporate campuses & regional hubs
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <DataTable columns={columns} data={locations} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Master Location">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Location Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Location</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
