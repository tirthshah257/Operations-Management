import React from 'react';
import Modal from './Modal';
import { Printer, QrCode, Barcode } from 'lucide-react';

export default function QrBarcodeModal({ isOpen, onClose, asset }) {
  if (!asset) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Asset Tag & Label — ${asset.assetId}`} maxWidth="max-w-md">
      <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          {asset.make} {asset.model}
        </h4>
        <p className="text-xs text-slate-500 mb-6 font-mono">S/N: {asset.serialNumber}</p>

        {/* QR Code SVG Demonstration */}
        <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col items-center mb-6">
          <svg className="w-36 h-36 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
            {/* Outer Frames */}
            <rect x="10" y="10" width="30" height="30" fill="none" stroke="#000000" strokeWidth="6" />
            <rect x="19" y="19" width="12" height="12" fill="#000000" />
            
            <rect x="60" y="10" width="30" height="30" fill="none" stroke="#000000" strokeWidth="6" />
            <rect x="69" y="19" width="12" height="12" fill="#000000" />

            <rect x="10" y="60" width="30" height="30" fill="none" stroke="#000000" strokeWidth="6" />
            <rect x="19" y="69" width="12" height="12" fill="#000000" />

            {/* Data Pattern */}
            <rect x="45" y="15" width="8" height="8" fill="#000000" />
            <rect x="45" y="30" width="8" height="8" fill="#000000" />
            <rect x="15" y="45" width="8" height="8" fill="#000000" />
            <rect x="30" y="45" width="8" height="8" fill="#000000" />
            <rect x="60" y="45" width="12" height="12" fill="#000000" />
            <rect x="75" y="60" width="12" height="12" fill="#000000" />
            <rect x="50" y="70" width="15" height="15" fill="#000000" />
          </svg>
          <span className="mt-2 text-[10px] font-mono tracking-widest text-slate-500 font-bold">{asset.qrCode}</span>
        </div>

        {/* Barcode Demonstration */}
        <div className="w-full p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-1 h-12 w-full">
            <div className="w-1 h-full bg-slate-900"></div>
            <div className="w-0.5 h-full bg-slate-900"></div>
            <div className="w-2 h-full bg-slate-900"></div>
            <div className="w-1 h-full bg-transparent"></div>
            <div className="w-1.5 h-full bg-slate-900"></div>
            <div className="w-1 h-full bg-slate-900"></div>
            <div className="w-3 h-full bg-slate-900"></div>
            <div className="w-1 h-full bg-transparent"></div>
            <div className="w-2 h-full bg-slate-900"></div>
            <div className="w-1 h-full bg-slate-900"></div>
            <div className="w-0.5 h-full bg-slate-900"></div>
            <div className="w-2.5 h-full bg-slate-900"></div>
          </div>
          <span className="mt-2 text-xs font-mono tracking-widest text-slate-800 font-semibold">{asset.barcode}</span>
        </div>

        <button
          onClick={handlePrint}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Asset Tag Label
        </button>
      </div>
    </Modal>
  );
}
