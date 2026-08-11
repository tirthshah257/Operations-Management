import React, { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileUpload({ files = [], onFilesChange }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addMockFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      addMockFiles(Array.from(e.target.files));
    }
  };

  const addMockFiles = (newFilesList) => {
    const formatted = newFilesList.map(f => ({
      id: `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fileName: f.name,
      fileType: f.type || 'document',
      fileSize: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString()
    }));
    onFilesChange([...files, ...formatted]);
  };

  const removeFile = (id) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
        }`}
      >
        <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload-input" />
        <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
          <UploadCloud className="w-8 h-8 text-blue-500 mb-2 stroke-[1.5]" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Click to upload or drag & drop files
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PNG, JPG (Max 10MB)</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">{file.fileName}</span>
                <span className="text-[10px] text-slate-400">({file.fileSize})</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
