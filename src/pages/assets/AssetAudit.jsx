import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { assetService } from '../../services/assetService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { CheckSquare, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AssetAudit() {
  const { assets, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const handleVerify = (assetId, status = 'Verified') => {
    assetService.updateVerification(assetId, { status });
    refreshAllState();
    addToast(`Asset ${assetId} marked as ${status}`, 'success');
  };

  const columns = [
    {
      header: 'Asset Tag',
      key: 'assetId',
      render: (row) => <span className="font-bold text-blue-600">{row.assetId}</span>
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
      header: 'Assigned User & Location',
      key: 'currentUserId',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{entityResolver.getUserName(row.currentUserId)}</p>
          <p className="text-[10px] text-slate-400">{entityResolver.getLocationName(row.locationId)}</p>
        </div>
      )
    },
    {
      header: 'Last Verified',
      key: 'lastVerifiedDate',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.lastVerifiedDate}</span>
    },
    {
      header: 'Audit Status',
      key: 'verificationStatus',
      render: (row) => <StatusBadge status={row.verificationStatus} />
    },
    {
      header: 'Verification Action',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex gap-1.5">
          <button
            onClick={() => handleVerify(row.id, 'Verified')}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            Mark Verified
          </button>
          <button
            onClick={() => handleVerify(row.id, 'Issue Found')}
            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            Flag Issue
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
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Asset Audit & Verification Interface
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Physical inventory verification log and audit status confirmation
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={assets} itemsPerPage={8} />
    </div>
  );
}
