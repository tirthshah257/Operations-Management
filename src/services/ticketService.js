import { storageService } from './storageService';
import { auditService } from './auditService';
import { complaintMatrixService } from './complaintMatrixService';
import { slaService } from './slaService';

export const ticketService = {
  getTickets() {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    return tickets.map(t => {
      const slaEval = slaService.evaluateTicketSla(t);
      return {
        ...t,
        slaEvaluation: slaEval,
        computedStatus: t.status === 'Solved' || t.status === 'Closed' ? t.status : (slaEval.isOverdue ? 'Breached' : t.status)
      };
    });
  },

  getTicketById(id) {
    return this.getTickets().find(t => t.id === id) || null;
  },

  getItTickets() {
    return this.getTickets().filter(t => t.ticketType === 'IT');
  },

  getAdminTickets() {
    return this.getTickets().filter(t => t.ticketType === 'Admin');
  },

  // Check active ticket limit for demo user (max 1 IT, max 1 Admin)
  getActiveTicketCount(userId, ticketType) {
    const tickets = this.getTickets();
    const activeStatuses = ['Open', 'Assigned', 'In Progress', 'Solved'];
    return tickets.filter(
      t => (t.requesterId === userId || !userId) && t.ticketType === ticketType && activeStatuses.includes(t.status)
    ).length;
  },

  createTicket(ticketData) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const count = tickets.length + 1001;
    const ticketId = `TKT-${count}`;

    const rule = ticketData.categoryId ? complaintMatrixService.getRuleById(ticketData.categoryId) : null;
    const priority = ticketData.priority || (rule ? rule.priority : 'Medium');
    const slaHours = ticketData.slaHours || (rule ? rule.slaHours : 8);
    const assignedTeamId = ticketData.assignedTeamId || (rule ? rule.teamId : 'TEAM-001');

    const createdDate = new Date().toISOString();
    const dueDate = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const newTicket = {
      id: ticketId,
      ticketNumber: ticketId,
      ticketType: ticketData.ticketType || (rule ? rule.ticketType : 'IT'),
      categoryId: ticketData.categoryId || null,
      category: ticketData.category || (rule ? rule.category : 'General'),
      subcategory: ticketData.subcategory || (rule ? rule.subcategory : 'General'),
      subject: ticketData.subject,
      description: ticketData.description,
      requesterId: ticketData.requesterId || 'USR-006',
      departmentId: ticketData.departmentId || 'DEPT-001',
      locationId: ticketData.locationId || 'LOC-005', // Default Aslali Factory
      priority,
      assignedTeamId,
      assignedUserId: ticketData.assignedUserId || null,
      assignedToName: ticketData.assignedToName || 'Unassigned',
      assetId: ticketData.assetId || null,
      slaHours,
      status: 'Open',
      escalationLevel: 'Level 1',
      createdDate,
      dueDate,
      resolution: null,
      resolvedBy: null,
      resolvedDate: null,
      feedbackRating: null,
      feedbackComment: null,
      attachments: ticketData.attachments || [],
      timeline: [
        {
          action: 'Ticket Created',
          user: ticketData.requesterName || 'User',
          timestamp: createdDate,
          notes: `Created ticket (${ticketData.ticketType || 'IT'} Ticket)`
        }
      ]
    };

    tickets.unshift(newTicket);
    storageService.setItem(storageService.KEYS.TICKETS, tickets);

    auditService.logAction({
      module: 'Ticketing',
      action: 'CREATE',
      recordId: ticketId,
      description: `Created ticket ${ticketId} [${newTicket.subject}]`
    });

    return newTicket;
  },

  assignTicket(id, { userId, assignedToName, assignedBy = 'System' }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].assignedUserId = userId;
      tickets[index].assignedToName = assignedToName || 'Assigned';
      tickets[index].status = 'Assigned';
      tickets[index].timeline.push({
        action: 'Ticket Assigned',
        user: assignedBy,
        timestamp: new Date().toISOString(),
        notes: `Assigned to ${assignedToName}`
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'ASSIGN',
        recordId: id,
        description: `Assigned ticket ${id} to ${assignedToName}`
      });
      return tickets[index];
    }
    return null;
  },

  startProgress(id, { user = 'Technician' } = {}) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].status = 'In Progress';
      tickets[index].timeline.push({
        action: 'Started In Progress',
        user,
        timestamp: new Date().toISOString(),
        notes: 'Work started on ticket'
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'STATUS_CHANGE',
        recordId: id,
        description: `Ticket ${id} moved to In Progress`
      });
      return tickets[index];
    }
    return null;
  },

  solveTicket(id, { resolutionRemarks, solvedBy = 'Technician' }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      tickets[index].status = 'Solved';
      tickets[index].resolution = resolutionRemarks;
      tickets[index].resolvedBy = solvedBy;
      tickets[index].resolvedDate = now;
      tickets[index].timeline.push({
        action: 'Ticket Solved',
        user: solvedBy,
        timestamp: now,
        notes: `Resolution Remarks: ${resolutionRemarks}`
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'SOLVE',
        recordId: id,
        description: `Solved ticket ${id}`
      });
      return tickets[index];
    }
    return null;
  },

  closeTicket(id, { closedBy = 'User' } = {}) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].status = 'Closed';
      tickets[index].timeline.push({
        action: 'Ticket Closed',
        user: closedBy,
        timestamp: new Date().toISOString(),
        notes: 'Ticket confirmed solved and closed'
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'CLOSE',
        recordId: id,
        description: `Closed ticket ${id}`
      });
      return tickets[index];
    }
    return null;
  },

  addComment(id, { user, commentText }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].timeline.push({
        action: 'Comment Added',
        user,
        timestamp: new Date().toISOString(),
        notes: commentText
      });
      storageService.setItem(storageService.KEYS.TICKETS, tickets);
      return tickets[index];
    }
    return null;
  },

  updateTicketStatus(id, newStatus, user = 'Admin', notes = '') {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      const prevStatus = tickets[index].status;
      tickets[index].status = newStatus;
      tickets[index].timeline.push({
        action: 'Status Changed',
        user,
        timestamp: new Date().toISOString(),
        notes: `Status changed from ${prevStatus} to ${newStatus}. ${notes}`
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);
      return tickets[index];
    }
    return null;
  }
};
