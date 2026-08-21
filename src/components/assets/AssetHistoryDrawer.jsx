import React from 'react';
import Drawer from '../common/Drawer';
import { History, UserCheck, MapPin, Calendar, FileText, ArrowRight } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

export default function AssetHistoryDrawer({ isOpen, onClose, asset }) {
  if (!asset) return null;

  const history = asset.allocationHistory || [];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Allocation History — ${asset.assetId}`} width="max-w-2xl">
      <div className="space-y-6 text-xs">
        {/* Asset Info Header Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{asset.assetId}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              asset.status === 'Allocated'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {asset.status}
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{asset.assetName || `${asset.make} ${asset.model}`}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div><span className="font-semibold text-slate-400">Current User:</span> <strong className="text-slate-900 dark:text-white">{asset.currentUserName || 'Unassigned'}</strong></div>
            <div><span className="font-semibold text-slate-400">Factory:</span> <strong className="text-slate-900 dark:text-white">{asset.locationName || 'Aslali Factory'}</strong></div>
            <div><span className="font-semibold text-slate-400">Serial #:</span> <strong className="font-mono text-slate-900 dark:text-white">{asset.serialNumber}</strong></div>
          </div>
        </div>

        {/* Chronological Timeline History List */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-blue-600" />
            Chronological Allocation & Transfer Logs ({history.length})
          </h4>

          {history.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6 pl-4 py-1">
              {history.map((h, idx) => (
                <div key={h.id || idx} className="relative group">
                  {/* Circle Node Indicator */}
                  <div className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    h.type === 'Reallocation' ? 'bg-purple-600' : 'bg-blue-600'
                  }`} />

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        h.type === 'Reallocation'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {h.type}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {h.date}
                      </span>
                    </div>

                    {/* User Transfer Display */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      {h.fromUserName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">{h.fromUserName}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-purple-600 dark:text-purple-400">{h.toUserName}</span>
                        </div>
                      ) : (
                        <span>Assigned to <strong className="text-blue-600 dark:text-blue-400">{h.toUserName}</strong></span>
                      )}
                    </div>

                    {/* Location / Factory Transfer Display */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {h.fromLocationName && h.fromLocationName !== h.toLocationName ? (
                        <div className="flex items-center gap-1.5">
                          <span>{h.fromLocationName}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{h.toLocationName}</span>
                        </div>
                      ) : (
                        <span>Factory: <strong>{h.toLocationName}</strong></span>
                      )}
                    </div>

                    {/* Notes / Reason */}
                    {h.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                        "{h.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <History className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No Allocation History Logs Yet</p>
              <p className="text-xs text-slate-500">Allocate or reallocate this asset to begin building historical tracking logs.</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
