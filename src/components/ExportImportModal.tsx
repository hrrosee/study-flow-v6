import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  mode: 'export' | 'import';
  dataToExport?: any;
  onImportData?: (jsonData: any) => void;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  mode,
  dataToExport,
  onImportData,
  onClose,
}) => {
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `studyflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMsg({ type: 'success', text: 'Data exported successfully!' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          setImportText(JSON.stringify(parsed, null, 2));
          setStatusMsg({ type: 'success', text: 'Valid StudyFlow backup file loaded.' });
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'Invalid JSON file structure.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (onImportData) {
        onImportData(parsed);
        setStatusMsg({ type: 'success', text: 'Data restored successfully!' });
        setTimeout(onClose, 1200);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to parse JSON. Please check syntax.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs cursor-pointer"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
        className="relative z-10 bg-white border border-[#E3E9F2] rounded-[12px] shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E9EDF3] flex items-center justify-between bg-[#FAFBFD]">
          <div className="flex items-center gap-2">
            {mode === 'export' ? (
              <Download className="w-5 h-5 text-[#176BFF]" />
            ) : (
              <Upload className="w-5 h-5 text-[#176BFF]" />
            )}
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'export' ? 'Export Workspaces & Data' : 'Import Backup Data'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {statusMsg && (
            <div
              className={`p-3 rounded-[8px] border text-xs font-semibold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {mode === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Download a complete JSON snapshot of all your workspaces, sections, topics, tasks, and recycle bin items.
              </p>
              <div className="p-3 bg-[#FAFBFD] border border-[#E5EAF2] rounded-[8px] font-mono text-[11px] text-slate-600 max-h-40 overflow-y-auto">
                {JSON.stringify(dataToExport, null, 2)}
              </div>
              <button
                onClick={handleDownloadExport}
                className="w-full py-2.5 bg-[#176BFF] hover:bg-blue-700 text-white font-bold text-xs rounded-[8px] flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON Backup</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Upload a JSON backup file or paste JSON code below to restore your workspaces.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload File</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#176BFF] hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Or Paste JSON</label>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste StudyFlow backup JSON here..."
                  className="w-full p-2.5 bg-[#FAFBFD] border border-[#D8E0EC] rounded-[8px] font-mono text-xs text-slate-800 focus:outline-none focus:border-[#176BFF]"
                ></textarea>
              </div>

              <button
                disabled={!importText.trim()}
                onClick={handleApplyImport}
                className="w-full py-2.5 bg-[#176BFF] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-[8px] flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Restore & Apply Backup</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E9EDF3] bg-[#FAFBFD] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#D8E0EC] text-slate-700 font-semibold text-xs rounded-[8px] hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
