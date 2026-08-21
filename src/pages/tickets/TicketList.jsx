import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import TicketDetailDrawer from './TicketDetailDrawer';
import TicketCreateModal from './TicketCreateModal';
import EmailTicketSimulator from './EmailTicketSimulator';
import { entityResolver } from '../../utils/entityResolver';
import { formatDateTime } from '../../utils/dateUtils';
import { Ticket, Plus, Mail, Eye, Filter, Laptop, Shield } from 'lucide-react';

export default function TicketList() {
  const { tickets, refreshAllState } = useAppData();
  const { activeRole, currentUser } = useAuth();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailSimulator, setShowEmailSimulator] = useState(false);
  const [typeTab, setTypeTab] = useState('ALL'); // 'ALL', 'IT', 'Admin'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'Open', 'Assigned', 'In Progress', 'Solved', 'Closed'

  const filteredTickets = tickets.filter(t => {
    // Role filter for End User (show own tickets)
    if (activeRole === 'End User' && t.requesterId !== currentUser?.id) {
      // allow seeing demo tickets
    }

    // Ticket Type Tab Filter
    if (typeTab === 'IT' && t.ticketType !== 'IT') return false;
    if (typeTab === 'Admin' && t.ticketType !== 'Admin') return false;

    // Status Filter
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'BREACHED') return t.slaEvaluation && t.slaEvaluation.isOverdue;
    return (t.computedStatus || t.status) === statusFilter;
  });

  const columns = [
    {
      header: 'Ticket ID',
      key: 'ticketNumber',
      render: (row) => (
        <button
          onClick={() => setSelectedTicket(row)}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.ticketNumber}
        </button>
      )
    },
    {
      header: 'Subject',
      key: 'subject',
      render: (row) => (
        <div className="max-w-xs">
          <span className="truncate block font-bold text-slate-900 dark:text-white">
            {row.subject}
          </span>
          <span className="text-[10px] text-slate-400 block">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Type',
      key: 'ticketType',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
          row.ticketType === 'IT'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
        }`}>
          {row.ticketType === 'IT' ? <Laptop className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
          {row.ticketType || 'IT'} Ticket
        </span>
      )
    },
    {
      header: 'Factory / Location',
      key: 'locationId',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {entityResolver.getLocationName(row.locationId)}
        </span>
      )
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.computedStatus || row.status} />
    },
    {
      header: 'Assigned To',
      key: 'assignedUserId',
      render: (row) => (
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {row.assignedToName || (row.assignedUserId ? entityResolver.getUserName(row.assignedUserId) : 'Unassigned')}
        </span>
      )
    },
    {
      header: 'Created Date',
      key: 'createdDate',
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
          {formatDateTime(row.createdDate)}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setSelectedTicket(row)}
          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Support Ticket Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete lifecycle tracking for IT & Admin complaints across Aslali and Radhu factories
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowEmailSimulator(true)}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Email Simulator</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Ticket Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setTypeTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            typeTab === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setTypeTab('IT')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            typeTab === 'IT'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Laptop className="w-4 h-4" />
          IT Tickets ({tickets.filter(t => t.ticketType === 'IT').length})
        </button>
        <button
          onClick={() => setTypeTab('Admin')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            typeTab === 'Admin'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          Admin Tickets ({tickets.filter(t => t.ticketType === 'Admin').length})
        </button>
      </div>

      {/* Status Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1 hidden sm:flex">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {['ALL', 'Open', 'Assigned', 'In Progress', 'Solved', 'Closed', 'BREACHED'].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === f
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {f === 'BREACHED' ? 'SLA Breached' : f}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filteredTickets} itemsPerPage={8} />

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <TicketDetailDrawer
          isOpen={!!selectedTicket}
          onClose={() => {
            setSelectedTicket(null);
            refreshAllState();
          }}
          ticket={selectedTicket}
        />
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <TicketCreateModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            refreshAllState();
          }}
        />
      )}

      {/* Email Simulator Modal */}
      {showEmailSimulator && (
        <EmailTicketSimulator
          isOpen={showEmailSimulator}
          onClose={() => {
            setShowEmailSimulator(false);
            refreshAllState();
          }}
        />
      )}
    </div>
  );
}
