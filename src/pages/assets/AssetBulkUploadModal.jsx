import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { assetService } from '../../services/assetService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function AssetBulkUploadModal({ isOpen, onClose }) {
  const { refreshAllState, vendors, departments, locations } = useAppData();
  const { addToast } = useToast();

  const [parsedRows, setParsedRows] = useState([]);
  const [errorRows, setErrorRows] = useState([]);

  const sampleCsvData = [
    { assetType: 'Hardware', category: 'Laptop', make: 'Lenovo', model: 'ThinkPad X1 Carbon', serialNumber: 'TP-X1-99881', purchaseCost: 145000, vendorId: 'VND-001', departmentId: 'DEPT-001', locationId: 'LOC-001' },
    { assetType: 'Hardware', category: 'Monitor', make: 'Dell', model: 'UltraSharp 27 4K', serialNumber: 'DELL-MON-4411', purchaseCost: 38000, vendorId: 'VND-001', departmentId: 'DEPT-001', locationId: 'LOC-001' }
  ];

  const handleSimulateFileParse = () => {
    // Parse sample CSV data
    setParsedRows(sampleCsvData);
    setErrorRows([]);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    assetService.bulkImportAssets(parsedRows);
    refreshAllState();
    addToast(`Successfully imported ${parsedRows.length} assets into inventory!`, 'success');
    onClose();
    setParsedRows([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Asset Import — CSV / Excel Parser" maxWidth="max-w-3xl">
      <div className="space-y-4 text-xs">
        <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
          <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <p className="font-bold text-slate-900 dark:text-white">Upload CSV or Excel Asset Inventory File</p>
          <p className="text-[11px] text-slate-400 mt-1">Required Columns: assetType, make, model, serialNumber, purchaseCost, vendorId, departmentId, locationId</p>
          
          <button
            onClick={handleSimulateFileParse}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
          >
            Parse & Validate Sample Asset File
          </button>
        </div>

        {/* Validation Results Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {parsedRows.length} Valid Records Ready for Import
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-500">
                  <tr>
                    <th className="p-2">Type</th>
                    <th className="p-2">Make & Model</th>
                    <th className="p-2">Serial #</th>
                    <th className="p-2">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsedRows.map((r, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold">{r.assetType}</td>
                      <td className="p-2">{r.make} {r.model}</td>
                      <td className="p-2 font-mono text-[10px]">{r.serialNumber}</td>
                      <td className="p-2 font-semibold text-emerald-600">₹{r.purchaseCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setParsedRows([])} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg">
                Cancel
              </button>
              <button onClick={handleConfirmImport} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm">
                Confirm & Import {parsedRows.length} Assets
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
