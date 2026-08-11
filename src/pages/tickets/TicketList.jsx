import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import TicketDetailDrawer from './TicketDetailDrawer';
import TicketCreateModal from './TicketCreateModal';
import EmailTicketSimulator from './EmailTicketSimulator';
import { entityResolver } from '../../utils/entityResolver';
import { Ticket, Plus, Mail, Eye, Filter } from 'lucide-react';

export default function TicketList() {
  const { tickets, refreshAllState } = useAppData();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailSimulator, setShowEmailSimulator] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'BREACHED') return t.slaEvaluation && t.slaEvaluation.isOverdue;
    return (t.computedStatus || t.status) === statusFilter;
  });

  const columns = [
    {
      header: 'Ticket #',
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
      header: 'Category & Subcategory',
      key: 'category',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.category}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{row.subcategory}</p>
        </div>
      )
    },
    {
      header: 'Subject',
      key: 'subject',
      render: (row) => (
        <span className="truncate max-w-xs block font-medium text-slate-800 dark:text-slate-200">
          {row.subject}
        </span>
      )
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'Requester',
      key: 'requesterId',
      render: (row) => (
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {entityResolver.getUserName(row.requesterId)}
        </span>
      )
    },
    {
      header: 'SLA Progress',
      key: 'slaProgress',
      render: (row) => {
        if (!row.slaEvaluation) return <span className="text-slate-400">—</span>;
        const { isOverdue, progressPercent, remainingHours } = row.slaEvaluation;
        return (
          <div className="w-28">
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span className={isOverdue ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'}>
                {isOverdue ? 'Breached' : `${remainingHours}h left`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isOverdue ? 'bg-rose-500' : progressPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        );
      }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Ticketing & Complaint Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unified support queue for IT, Admin, HVAC, Power & Maintenance complaints
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
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1 hidden sm:flex">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['ALL', 'Open', 'In Progress', 'Resolved', 'Closed', 'BREACHED'].map(f => (
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
