import React, { useState, useMemo } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import TicketDetailDrawer from './TicketDetailDrawer';
import TicketCreateModal from './TicketCreateModal';
import EmailTicketSimulator from './EmailTicketSimulator';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { entityResolver } from '../../utils/entityResolver';
import { formatDateTime } from '../../utils/dateUtils';
import { Ticket, Plus, Mail, Download, Filter, Eye } from 'lucide-react';

export default function TicketList() {
  const { tickets, departments, locations } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch =
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || t.computedStatus === statusFilter || t.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchType = typeFilter === 'ALL' || t.ticketType === typeFilter;

      return matchSearch && matchStatus && matchPriority && matchType;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, typeFilter]);

  const handleExportExcel = () => {
    const exportData = filteredTickets.map(t => ({
      'Ticket #': t.ticketNumber,
      'Type': t.ticketType,
      'Category': t.category,
      'Subcategory': t.subcategory,
      'Subject': t.subject,
      'Priority': t.priority,
      'Status': t.computedStatus || t.status,
      'Requester': entityResolver.getUserName(t.requesterId),
      'Department': entityResolver.getDepartmentName(t.departmentId),
      'Created Date': formatDateTime(t.createdDate)
    }));
    exportToExcel(exportData, 'tickets_report.xlsx', 'Tickets');
  };

  const handleExportPDF = () => {
    const headers = ['Ticket #', 'Category', 'Subject', 'Priority', 'Status', 'Created'];
    const rows = filteredTickets.map(t => [
      t.ticketNumber,
      t.category,
      t.subject.substring(0, 30),
      t.priority,
      t.computedStatus || t.status,
      formatDateTime(t.createdDate)
    ]);
    exportToPDF(headers, rows, 'Support Complaint Tickets Report', 'tickets_report.pdf');
  };

  const columns = [
    {
      header: 'Ticket #',
      key: 'ticketNumber',
      render: (row) => (
        <span className="font-bold text-blue-600 dark:text-blue-400">{row.ticketNumber}</span>
      )
    },
    {
      header: 'Type & Category',
      key: 'category',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.category}</p>
          <p className="text-[10px] text-slate-500">{row.ticketType} • {row.subcategory}</p>
        </div>
      )
    },
    {
      header: 'Subject Title',
      key: 'subject',
      render: (row) => (
        <span className="truncate max-w-xs block font-medium" title={row.subject}>{row.subject}</span>
      )
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'Assigned Team',
      key: 'assignedTeamId',
      render: (row) => (
        <span className="text-slate-600 dark:text-slate-300">{entityResolver.getTeamName(row.assignedTeamId)}</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.computedStatus || row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setSelectedTicket(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-blue-600" />
            Ticketing & Complaint Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unified support queue for IT, Admin, HVAC, Power & Maintenance complaints
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            Email Ticket Simulator
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Raise Ticket
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tickets, subject, category..." />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Breached">SLA Breached</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="ALL">All Types</option>
            <option value="IT">IT</option>
            <option value="Admin">Admin</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={handleExportExcel}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
            title="Export Excel"
          >
            <Download className="w-3.5 h-3.5" />
            Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
            title="Export PDF"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable columns={columns} data={filteredTickets} itemsPerPage={8} emptyMessage="No tickets found matching filters." />

      {/* Drawers & Modals */}
      <TicketDetailDrawer isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} ticket={selectedTicket} />
      <TicketCreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <EmailTicketSimulator isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
    </div>
  );
}
