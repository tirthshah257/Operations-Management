import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import ChartCard from '../../components/common/ChartCard';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { SlidersHorizontal, Play, Download, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CustomReportBuilder() {
  const { tickets, assets, expenses, stationery } = useAppData();

  const [selectedModule, setSelectedModule] = useState('TICKETS');
  const [groupByField, setGroupByField] = useState('category');
  const [chartType, setChartType] = useState('bar');
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerate = () => {
    let sourceData = tickets;
    if (selectedModule === 'ASSETS') sourceData = assets;
    if (selectedModule === 'EXPENSES') sourceData = expenses;
    if (selectedModule === 'STATIONERY') sourceData = stationery;

    // Grouping logic
    const grouped = {};
    sourceData.forEach(item => {
      const key = item[groupByField] || 'Unspecified';
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const chartArray = Object.entries(grouped).map(([name, count]) => ({ name, count }));

    setGeneratedReport({
      module: selectedModule,
      data: sourceData,
      chartData: chartArray
    });
  };

  const handleExportExcel = () => {
    if (!generatedReport) return;
    exportToExcel(generatedReport.data, `custom_${selectedModule.toLowerCase()}_report.xlsx`);
  };

  const handleExportPDF = () => {
    if (!generatedReport) return;
    const headers = ['Key ID', 'Group Field', 'Subject/Detail'];
    const rows = generatedReport.data.map(item => [
      item.id || item.ticketNumber || item.assetId || item.expenseNumber,
      item[groupByField] || 'N/A',
      item.subject || item.make || item.description || 'N/A'
    ]);
    exportToPDF(headers, rows, `Custom ${selectedModule} Builder Report`, `custom_report.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" />
            Custom Enterprise Report Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pick module source, select columns, apply group-by fields, generate custom charts & client-side exports
          </p>
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Report Configuration Panel</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">1. Select Data Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              <option value="TICKETS">Tickets Module</option>
              <option value="ASSETS">Assets Module</option>
              <option value="EXPENSES">Expenses Module</option>
              <option value="STATIONERY">Stationery Module</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">2. Group By Field</label>
            <select
              value={groupByField}
              onChange={(e) => setGroupByField(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              {selectedModule === 'TICKETS' && (
                <>
                  <option value="category">Category</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="ticketType">Ticket Type</option>
                </>
              )}
              {selectedModule === 'ASSETS' && (
                <>
                  <option value="assetType">Asset Type</option>
                  <option value="status">Status</option>
                  <option value="make">Make / Brand</option>
                </>
              )}
              {selectedModule === 'EXPENSES' && (
                <>
                  <option value="module">Module Source</option>
                  <option value="category">Category</option>
                  <option value="status">Status</option>
                </>
              )}
              {selectedModule === 'STATIONERY' && (
                <>
                  <option value="status">Stock Status</option>
                  <option value="unit">Unit</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">3. Visualization Chart</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Generate Custom Report
          </button>
        </div>
      </div>

      {/* Report Results */}
      {generatedReport && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generated Report Results ({generatedReport.data.length} Records)</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                PDF
              </button>
            </div>
          </div>

          <ChartCard title={`Custom Grouping by ${groupByField}`} subtitle={`Aggregated ${generatedReport.module} dataset`}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={generatedReport.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
