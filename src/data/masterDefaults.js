export const DEFAULT_DEPARTMENTS = [
  { id: 'DEPT-001', name: 'Information Technology', code: 'IT', head: 'Rahul Mehta', description: 'Core IT Infrastructure, Hardware, and Software Systems', status: 'Active' },
  { id: 'DEPT-002', name: 'Administration', code: 'ADM', head: 'Priya Sharma', description: 'Facility, Housekeeping, Travel, and General Admin Operations', status: 'Active' },
  { id: 'DEPT-003', name: 'Human Resources', code: 'HR', head: 'Anjali Verma', description: 'Talent Acquisition, Employee Relations, and Onboarding', status: 'Active' },
  { id: 'DEPT-004', name: 'Finance & Accounting', code: 'FIN', head: 'Vikram Joshi', description: 'Budgeting, Expenses, Payroll, and Audit Compliance', status: 'Active' },
  { id: 'DEPT-005', name: 'Operations', code: 'OPS', head: 'Suresh Kumar', description: 'Business Operations, Logistics, and Field Execution', status: 'Active' },
  { id: 'DEPT-006', name: 'Maintenance & Facilities', code: 'MAINT', head: 'Ramesh Patel', description: 'Electrical, HVAC, Plumbing, and Building Maintenance', status: 'Active' },
  { id: 'DEPT-007', name: 'Procurement', code: 'PROC', head: 'Neha Gupta', description: 'Vendor Management, Contracting, and Procurement Logistics', status: 'Active' },
];

export const DEFAULT_LOCATIONS = [
  { id: 'LOC-001', name: 'Tech Park Campus (Ahmedabad)', code: 'AMD-HQ', address: 'SG Highway, Bodakdev', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', contactPerson: 'Karan Patel', status: 'Active' },
  { id: 'LOC-002', name: 'Corporate Office (Mumbai)', code: 'BOM-CORP', address: 'Bandra Kurla Complex (BKC)', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', contactPerson: 'Sneha Kulkarni', status: 'Active' },
  { id: 'LOC-003', name: 'Regional Office (Delhi NCR)', code: 'DEL-REG', address: 'Cyber City, Phase 2', city: 'Gurugram', state: 'Haryana', pincode: '122002', contactPerson: 'Amitabh Roy', status: 'Active' },
  { id: 'LOC-004', name: 'Operations Hub (Bengaluru)', code: 'BLR-OPS', address: 'Outer Ring Road, Marathahalli', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', contactPerson: 'Deepak Nair', status: 'Active' },
];

export const DEFAULT_TEAMS = [
  { id: 'TEAM-001', name: 'IT Support Team', departmentId: 'DEPT-001', teamLead: 'USR-004', members: ['USR-004', 'USR-005'], locationId: 'LOC-001', description: 'First line hardware, software & user support', status: 'Active' },
  { id: 'TEAM-002', name: 'Infra & Network Team', departmentId: 'DEPT-001', teamLead: 'USR-004', members: ['USR-004'], locationId: 'LOC-001', description: 'Servers, Cloud, Switches, Firewalls & Wi-Fi', status: 'Active' },
  { id: 'TEAM-003', name: 'Facility & HVAC Team', departmentId: 'DEPT-006', teamLead: 'USR-005', members: ['USR-005'], locationId: 'LOC-001', description: 'AC units, Plumbing, Lighting & Civil fixes', status: 'Active' },
  { id: 'TEAM-004', name: 'Admin Operations Desk', departmentId: 'DEPT-002', teamLead: 'USR-003', members: ['USR-003'], locationId: 'LOC-002', description: 'Stationery, Couriers, Inward/Outward & Pantry', status: 'Active' },
  { id: 'TEAM-005', name: 'Finance Audit Desk', departmentId: 'DEPT-004', teamLead: 'USR-007', members: ['USR-007'], locationId: 'LOC-002', description: 'Expense approvals, vendor payments & contract verification', status: 'Active' },
];

export const DEFAULT_VENDORS = [
  { id: 'VND-001', name: 'TechCorp Solutions Pvt Ltd', code: 'TC-01', vendorType: 'Hardware & IT', contactPerson: 'Rajesh Shah', email: 'support@techcorp.com', phone: '+91 98765 43210', address: 'CG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', gstNumber: '24AAAAA0000A1Z5', category: 'Hardware Supplier', status: 'Active', notes: 'Primary laptop and desktop vendor' },
  { id: 'VND-002', name: 'ChillAir HVAC Services', code: 'CA-02', vendorType: 'Maintenance & Service', contactPerson: 'Manish Trivedi', email: 'service@chillair.in', phone: '+91 98250 11223', address: 'Naroda GIDC', city: 'Ahmedabad', state: 'Gujarat', pincode: '382330', gstNumber: '24BBBBB1111B1Z2', category: 'Air Conditioning', status: 'Active', notes: 'Provides AMC for all office AC split & duct units' },
  { id: 'VND-003', name: 'PowerGuard UPS Systems', code: 'PG-03', vendorType: 'Electrical & Power', contactPerson: 'Sunil Rao', email: 'info@powerguard.com', phone: '+91 91234 56789', address: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069', gstNumber: '27CCCCC2222C1Z8', category: 'UPS & Generators', status: 'Active', notes: 'Heavy duty commercial 100KVA UPS maintenance' },
  { id: 'VND-004', name: 'Ergonomic Office Solutions', code: 'EOS-04', vendorType: 'Furniture Supplier', contactPerson: 'Kavita Menon', email: 'sales@ergosolutions.com', phone: '+91 99887 76655', address: 'MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', gstNumber: '29DDDDD3333D1Z4', category: 'Furniture', status: 'Active', notes: 'Modular workdesks and ergonomic mesh chairs' },
  { id: 'VND-005', name: 'SwiftCourier Logistics', code: 'SCL-05', vendorType: 'Courier & Logistics', contactPerson: 'Vikram Sethi', email: 'corporate@swiftcourier.in', phone: '+91 93344 55667', address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', gstNumber: '07EEEEE4444E1Z1', category: 'Courier', status: 'Active', notes: 'Inter-office parcel delivery and document logistics' },
  { id: 'VND-006', name: 'OfficeStationery Direct', code: 'OSD-06', vendorType: 'Stationery Supplier', contactPerson: 'Ramesh Agarwal', email: 'orders@stationerydirect.com', phone: '+91 97766 55443', address: 'Maninagar', city: 'Ahmedabad', state: 'Gujarat', pincode: '380008', gstNumber: '24FFFFF5555F1Z9', category: 'Stationery', status: 'Active', notes: 'Paper, toner cartridges, pens, folders bulk supplier' },
  { id: 'VND-007', name: 'CloudInfra Software Solutions', code: 'CIS-07', vendorType: 'Software Licensing', contactPerson: 'David Miller', email: 'licensing@cloudinfra.io', phone: '+1 408 555 0199', address: 'Silicon Valley', city: 'San Jose', state: 'California', pincode: '95110', gstNumber: 'NA-USA-VENDOR', category: 'SaaS Software', status: 'Active', notes: 'Enterprise software licenses (Microsoft 365, Adobe, Jira)' },
];

export const DEFAULT_USERS = [
  { id: 'USR-001', name: 'System Administrator', email: 'admin@enterprise.com', role: 'Super Admin', roleId: 'ROLE-001', departmentId: 'DEPT-001', locationId: 'LOC-001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-002', name: 'Krunal Patel', email: 'krunal.patel@enterprise.com', role: 'Admin', roleId: 'ROLE-002', departmentId: 'DEPT-001', locationId: 'LOC-001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-003', name: 'Priya Sharma', email: 'priya.sharma@enterprise.com', role: 'Manager', roleId: 'ROLE-003', departmentId: 'DEPT-002', locationId: 'LOC-002', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-004', name: 'Rahul Mehta', email: 'rahul.mehta@enterprise.com', role: 'IT Admin', roleId: 'ROLE-004', departmentId: 'DEPT-001', locationId: 'LOC-001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-005', name: 'Amit Joshi', email: 'amit.joshi@enterprise.com', role: 'Technician', roleId: 'ROLE-005', departmentId: 'DEPT-006', locationId: 'LOC-001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-006', name: 'Neha Gupta', email: 'neha.gupta@enterprise.com', role: 'End User', roleId: 'ROLE-006', departmentId: 'DEPT-003', locationId: 'LOC-003', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-007', name: 'Vikram Joshi', email: 'vikram.joshi@enterprise.com', role: 'Finance', roleId: 'ROLE-009', departmentId: 'DEPT-004', locationId: 'LOC-002', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-008', name: 'Suresh Kumar', email: 'suresh.kumar@enterprise.com', role: 'Project Manager', roleId: 'ROLE-007', departmentId: 'DEPT-005', locationId: 'LOC-004', status: 'Active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-009', name: 'Ramesh Patel', email: 'ramesh.patel@enterprise.com', role: 'Inventory Manager', roleId: 'ROLE-008', departmentId: 'DEPT-002', locationId: 'LOC-001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
];

export const DEFAULT_ROLES = [
  { id: 'ROLE-001', name: 'Super Admin', permissions: ['all'] },
  { id: 'ROLE-002', name: 'Admin', permissions: ['view', 'create', 'edit', 'delete', 'approve', 'assign', 'export', 'configure'] },
  { id: 'ROLE-003', name: 'Manager', permissions: ['view', 'create', 'edit', 'approve', 'export', 'reports'] },
  { id: 'ROLE-004', name: 'IT Admin', permissions: ['view', 'create', 'edit', 'assign', 'tickets', 'assets', 'licenses'] },
  { id: 'ROLE-005', name: 'Technician', permissions: ['view', 'edit_assigned_tickets', 'update_status', 'add_comment'] },
  { id: 'ROLE-006', name: 'End User', permissions: ['view_own_tickets', 'create_ticket', 'view_own_assets', 'knowledge_base'] },
  { id: 'ROLE-007', name: 'Project Manager', permissions: ['view', 'projects', 'tasks', 'expenses'] },
  { id: 'ROLE-008', name: 'Inventory Manager', permissions: ['view', 'stationery', 'inward', 'outward', 'courier'] },
  { id: 'ROLE-009', name: 'Finance', permissions: ['view', 'expenses', 'agreements', 'licenses', 'reports'] },
];

export const DEFAULT_COMPLAINT_MATRIX = [
  { id: 'CM-001', category: 'Facility / HVAC', subcategory: 'AC Unit', ticketType: 'Maintenance', example: 'AC not cooling, water leakage from split AC', priority: 'High', slaHours: 4, teamId: 'TEAM-003', departmentId: 'DEPT-006', status: 'Active' },
  { id: 'CM-002', category: 'Power / Electrical', subcategory: 'UPS & Generator', ticketType: 'Maintenance', example: 'UPS beep alarm, battery backup failing during outage', priority: 'High', slaHours: 2, teamId: 'TEAM-003', departmentId: 'DEPT-006', status: 'Active' },
  { id: 'CM-003', category: 'IT & Hardware', subcategory: 'Laptop / Desktop', ticketType: 'IT', example: 'Laptop display blue screen, RAM upgrade request, battery issue', priority: 'Medium', slaHours: 8, teamId: 'TEAM-001', departmentId: 'DEPT-001', status: 'Active' },
  { id: 'CM-004', category: 'Network / Internet', subcategory: 'Wi-Fi & LAN', ticketType: 'IT', example: 'Wi-Fi disconnects frequently, LAN cable damaged', priority: 'High', slaHours: 4, teamId: 'TEAM-002', departmentId: 'DEPT-001', status: 'Active' },
  { id: 'CM-005', category: 'Furniture', subcategory: 'Chair & Desk', ticketType: 'Admin', example: 'Ergonomic chair wheel broken, desk lock stuck', priority: 'Medium', slaHours: 12, teamId: 'TEAM-004', departmentId: 'DEPT-002', status: 'Active' },
  { id: 'CM-006', category: 'General Admin', subcategory: 'Housekeeping & Pantry', ticketType: 'Admin', example: 'Drinking water cooler refill required, floor cleaning request', priority: 'Low', slaHours: 24, teamId: 'TEAM-004', departmentId: 'DEPT-002', status: 'Active' },
  { id: 'CM-007', category: 'Courier & Logistics', subcategory: 'Inward / Outward', ticketType: 'Admin', example: 'Urgent document dispatch required, incoming parcel trace', priority: 'Medium', slaHours: 6, teamId: 'TEAM-004', departmentId: 'DEPT-002', status: 'Active' },
  { id: 'CM-008', category: 'Stationery', subcategory: 'Office Supplies', ticketType: 'Admin', example: 'A4 paper bundle request, printer toner cartridge replacement', priority: 'Low', slaHours: 12, teamId: 'TEAM-004', departmentId: 'DEPT-002', status: 'Active' },
];

export const DEFAULT_ESCALATION_MATRIX = [
  { id: 'ESC-001', level: 'Level 1', triggerCondition: 'Ticket Created / Assigned', delayHours: 0, recipientRole: 'Technician', teamId: 'TEAM-001', status: 'Active' },
  { id: 'ESC-002', level: 'Level 2', triggerCondition: 'SLA Approaching (50% Elapsed)', delayHours: 2, recipientRole: 'Team Lead', teamId: 'TEAM-001', status: 'Active' },
  { id: 'ESC-003', level: 'Level 3', triggerCondition: 'SLA Breached (100% Elapsed)', delayHours: 4, recipientRole: 'Department Manager', teamId: 'TEAM-001', status: 'Active' },
  { id: 'ESC-004', level: 'Level 4', triggerCondition: 'Overdue by +12 Hours', delayHours: 12, recipientRole: 'Administrator', teamId: 'TEAM-001', status: 'Active' },
];

export const DEFAULT_SETTINGS = {
  general: {
    companyName: 'Enterprise SaaS Solutions Ltd',
    systemTitle: 'Asset & Ticketing Management Portal',
    currency: 'INR (₹)',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-Hour (AM/PM)',
    timezone: 'Asia/Kolkata (IST)',
  },
  emailIntegration: {
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    username: 'notifications@enterprise.com',
    fromEmail: 'noreply@enterprise.com',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    popHost: 'pop.office365.com',
    popPort: 995,
    enableNotifications: true,
    enableTicketEmailSimulation: true,
    statusLabel: 'Email Configuration Demo'
  },
  notificationRules: {
    agreementExpiryDays: [90, 60, 30, 15],
    licenseExpiryDays: [60, 30, 15, 7],
    stationeryLowStockThreshold: true,
    slaWarningEnabled: true,
    projectDeadlineWarningDays: 7
  }
};
