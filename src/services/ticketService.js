import { storageService } from './storageService';
import { auditService } from './auditService';
import { complaintMatrixService } from './complaintMatrixService';
import { slaService } from './slaService';

export const ticketService = {
  getTickets() {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    // Re-evaluate SLA status dynamically
    return tickets.map(t => {
      const slaEval = slaService.evaluateTicketSla(t);
      return {
        ...t,
        slaEvaluation: slaEval,
        computedStatus: t.status === 'Resolved' || t.status === 'Closed' ? t.status : (slaEval.isOverdue ? 'Breached' : t.status)
      };
    });
  },

  getTicketById(id) {
    return this.getTickets().find(t => t.id === id) || null;
  },

  createTicket(ticketData) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const count = tickets.length + 1001;
    const ticketId = `TKT-${count}`;

    // Matrix lookup if categoryId provided
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
      requesterId: ticketData.requesterId || 'USR-002',
      departmentId: ticketData.departmentId || 'DEPT-001',
      locationId: ticketData.locationId || 'LOC-001',
      priority,
      assignedTeamId,
      assignedUserId: ticketData.assignedUserId || null,
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
          user: ticketData.requesterName || 'Employee',
          timestamp: createdDate,
          notes: ticketData.createdChannel === 'Email' ? 'Created via Email Ticket Simulator' : 'Created via Portal'
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

      auditService.logAction({
        module: 'Ticketing',
        action: 'STATUS_CHANGE',
        recordId: id,
        description: `Ticket ${id} status updated from ${prevStatus} to ${newStatus}`,
        previousValue: prevStatus,
        newValue: newStatus
      });
      return tickets[index];
    }
    return null;
  },

  assignTicket(id, { teamId, userId, assignedBy = 'Admin' }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      if (teamId) tickets[index].assignedTeamId = teamId;
      if (userId !== undefined) tickets[index].assignedUserId = userId;

      tickets[index].timeline.push({
        action: 'Assignment Updated',
        user: assignedBy,
        timestamp: new Date().toISOString(),
        notes: `Assigned team set to ${teamId || 'Unchanged'}, technician set to ${userId || 'Unassigned'}`
      });

      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'ASSIGN',
        recordId: id,
        description: `Reassigned ticket ${id} to team ${teamId} / technician ${userId}`
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

  resolveTicket(id, { resolvedBy, resolutionText }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      tickets[index].status = 'Resolved';
      tickets[index].resolution = resolutionText;
      tickets[index].resolvedBy = resolvedBy;
      tickets[index].resolvedDate = now;
      tickets[index].timeline.push({
        action: 'Resolution Provided',
        user: resolvedBy,
        timestamp: now,
        notes: `Resolved: ${resolutionText}`
      });
      storageService.setItem(storageService.KEYS.TICKETS, tickets);

      auditService.logAction({
        module: 'Ticketing',
        action: 'RESOLVE',
        recordId: id,
        description: `Resolved ticket ${id}`
      });
      return tickets[index];
    }
    return null;
  },

  submitFeedback(id, { rating, comment, action = 'accept' }) {
    const tickets = storageService.getItem(storageService.KEYS.TICKETS, []);
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].feedbackRating = rating;
      tickets[index].feedbackComment = comment;

      if (action === 'reopen') {
        tickets[index].status = 'Reopened';
        tickets[index].timeline.push({
          action: 'Ticket Reopened',
          user: 'Requester',
          timestamp: new Date().toISOString(),
          notes: `Reopened ticket. Reason: ${comment}`
        });
      } else {
        tickets[index].status = 'Closed';
        tickets[index].timeline.push({
          action: 'Ticket Closed',
          user: 'Requester',
          timestamp: new Date().toISOString(),
          notes: `Resolution accepted with ${rating} Star Rating`
        });
      }
      storageService.setItem(storageService.KEYS.TICKETS, tickets);
      return tickets[index];
    }
    return null;
  },

  simulateEmailTicket(emailData) {
    const suggestedRule = complaintMatrixService.matchKeywordSuggestion(emailData.subject + ' ' + emailData.body);

    return this.createTicket({
      ticketType: suggestedRule ? suggestedRule.ticketType : 'IT',
      categoryId: suggestedRule ? suggestedRule.id : null,
      category: suggestedRule ? suggestedRule.category : 'Email Request',
      subcategory: suggestedRule ? suggestedRule.subcategory : 'General',
      subject: emailData.subject,
      description: `[Email Sender: ${emailData.senderEmail}]\n\n${emailData.body}`,
      requesterId: 'USR-006',
      departmentId: 'DEPT-003',
      locationId: 'LOC-003',
      priority: suggestedRule ? suggestedRule.priority : 'Medium',
      slaHours: suggestedRule ? suggestedRule.slaHours : 8,
      assignedTeamId: suggestedRule ? suggestedRule.teamId : 'TEAM-001',
      createdChannel: 'Email'
    });
  }
};
