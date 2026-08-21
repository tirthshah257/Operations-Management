export const INITIAL_TICKETS = [
  {
    id: 'TKT-1001',
    ticketNumber: 'TKT-1001',
    ticketType: 'IT',
    categoryId: 'CM-003',
    category: 'IT & Hardware',
    subcategory: 'Laptop / Desktop',
    subject: 'Aslali Factory Production Line Laptop Blue Screen Error',
    description: 'The laptop used at Aslali Factory packing unit keeps crashing with BSOD during barcode scanning.',
    requesterId: 'USR-006',
    departmentId: 'DEPT-001',
    locationId: 'LOC-005', // Aslali Factory
    priority: 'Critical',
    assignedTeamId: 'TEAM-001',
    assignedUserId: 'USR-004', // Mithun Parmar
    assignedToName: 'Mithun Parmar',
    assetId: 'AST-1001',
    slaHours: 4,
    status: 'In Progress',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [
      { id: 'ATT-1', fileName: 'blue_screen_aslali.jpg', fileType: 'image/jpeg', fileSize: '1.2 MB', uploadedAt: new Date().toISOString() }
    ],
    timeline: [
      { action: 'Ticket Created', user: 'Neha Gupta', timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), notes: 'Created via Web Portal at Aslali Factory' },
      { action: 'Assigned to Mithun', user: 'System', timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(), notes: 'Assigned to Mithun Parmar' },
      { action: 'Started In Progress', user: 'Mithun Parmar', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), notes: 'Testing RAM and updating graphics driver' }
    ]
  },
  {
    id: 'TKT-1002',
    ticketNumber: 'TKT-1002',
    ticketType: 'IT',
    categoryId: 'CM-004',
    category: 'Network / Internet',
    subcategory: 'Wi-Fi & LAN',
    subject: 'Radhu Factory Dispatch Bay Wi-Fi Signal Drop',
    description: 'Employees in the Radhu Factory dispatch bay experience frequent Wi-Fi disconnections.',
    requesterId: 'USR-006',
    departmentId: 'DEPT-001',
    locationId: 'LOC-006', // Radhu Factory
    priority: 'High',
    assignedTeamId: 'TEAM-001',
    assignedUserId: 'USR-010', // Rohan Shah
    assignedToName: 'Rohan Shah',
    assetId: 'AST-1006',
    slaHours: 4,
    status: 'Assigned',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Neha Gupta', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), notes: 'Created via Web Portal' },
      { action: 'Assigned to Rohan', user: 'Mithun Parmar', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), notes: 'Assigned to Rohan Shah for Wi-Fi access point check' }
    ]
  },
  {
    id: 'TKT-1003',
    ticketNumber: 'TKT-1003',
    ticketType: 'Admin',
    categoryId: 'CM-001',
    category: 'Facility / HVAC',
    subcategory: 'AC Unit',
    subject: 'Aslali Factory Executive Cabin AC Water Leakage',
    description: 'Split AC unit in the manager cabin at Aslali Factory leaking water onto desk.',
    requesterId: 'USR-003',
    departmentId: 'DEPT-002',
    locationId: 'LOC-005', // Aslali Factory
    priority: 'High',
    assignedTeamId: 'TEAM-004',
    assignedUserId: 'USR-002', // Kiran Patel
    assignedToName: 'Kiran Patel',
    assetId: null,
    slaHours: 6,
    status: 'Open',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Priya Sharma', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), notes: 'Admin Ticket raised for Aslali Factory' }
    ]
  },
  {
    id: 'TKT-1004',
    ticketNumber: 'TKT-1004',
    ticketType: 'Admin',
    categoryId: 'CM-006',
    category: 'General Admin',
    subcategory: 'Housekeeping & Pantry',
    subject: 'Radhu Factory Drinking Water Dispenser Filter Change',
    description: 'Water dispenser filter replacement required at Radhu Factory staff room.',
    requesterId: 'USR-006',
    departmentId: 'DEPT-002',
    locationId: 'LOC-006', // Radhu Factory
    priority: 'Medium',
    assignedTeamId: 'TEAM-004',
    assignedUserId: 'USR-002', // Kiran Patel
    assignedToName: 'Kiran Patel',
    assetId: null,
    slaHours: 12,
    status: 'Solved',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    resolution: 'Replaced carbon filter and sanitized water tank. Tested water quality OK.',
    resolvedBy: 'Kiran Patel',
    resolvedDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    feedbackRating: 5,
    feedbackComment: 'Great quick service by Kiran Patel.',
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Neha Gupta', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), notes: 'Ticket logged' },
      { action: 'Assigned to Kiran Patel', user: 'System', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), notes: 'Admin ticket assigned' },
      { action: 'Started In Progress', user: 'Kiran Patel', timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), notes: 'Technician on site' },
      { action: 'Ticket Solved', user: 'Kiran Patel', timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), notes: 'Replaced filter and tested' }
    ]
  },
  {
    id: 'TKT-1005',
    ticketNumber: 'TKT-1005',
    ticketType: 'IT',
    categoryId: 'CM-003',
    category: 'IT & Hardware',
    subcategory: 'Printer / Scanner',
    subject: 'Aslali Factory Barcode Label Printer Configuration',
    description: 'Configure Zebra ZT411 barcode printer for new inventory tagging station at Aslali Factory.',
    requesterId: 'USR-009',
    departmentId: 'DEPT-001',
    locationId: 'LOC-005', // Aslali Factory
    priority: 'Medium',
    assignedTeamId: 'TEAM-001',
    assignedUserId: 'USR-011', // Arvind Patel
    assignedToName: 'Arvind Patel',
    assetId: 'AST-1005',
    slaHours: 8,
    status: 'Closed',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    resolution: 'Installed Zebra drivers, configured IP 192.168.5.50, printed test labels successfully.',
    resolvedBy: 'Arvind Patel',
    resolvedDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    feedbackRating: 5,
    feedbackComment: 'Fully functional, thank you Arvind!',
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Ramesh Patel', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), notes: 'Request for barcode setup' },
      { action: 'Assigned to Arvind', user: 'Mithun Parmar', timestamp: new Date(Date.now() - 44 * 3600 * 1000).toISOString(), notes: 'Assigned to Arvind Patel' },
      { action: 'Started In Progress', user: 'Arvind Patel', timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), notes: 'Driver installation' },
      { action: 'Ticket Solved', user: 'Arvind Patel', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), notes: 'Test print verified' },
      { action: 'Ticket Closed', user: 'Ramesh Patel', timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), notes: 'User confirmed working' }
    ]
  }
];

export const INITIAL_ASSETS = [
  {
    id: 'AST-1001',
    assetId: 'AST-1001',
    assetName: 'Dell Latitude 5540 Workstation',
    qrCode: 'AST-1001-QR',
    barcode: '8901234567890',
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'Dell',
    model: 'Latitude 5540',
    serialNumber: 'DELL-ASL-9901',
    purchaseDate: '2025-01-15',
    purchaseCost: 85000,
    vendorId: 'VND-001',
    warrantyStart: '2025-01-15',
    warrantyExpiry: '2028-01-14',
    amc: 'Dell ProSupport Enterprise',
    currentUserId: 'USR-004', // Mithun Parmar
    currentUserName: 'Mithun Parmar',
    departmentId: 'DEPT-001',
    locationId: 'LOC-005', // Aslali Factory
    locationName: 'Aslali Factory',
    allocationDate: '2026-01-10',
    status: 'Allocated',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-07-01',
    allocationHistory: [
      {
        id: 'ALH-101',
        type: 'Allocation',
        fromUserId: null,
        fromUserName: null,
        toUserId: 'USR-004',
        toUserName: 'Mithun Parmar',
        fromLocationId: null,
        fromLocationName: null,
        toLocationId: 'LOC-005',
        toLocationName: 'Aslali Factory',
        date: '2026-01-10',
        notes: 'Initial allocation for IT Lead at Aslali Factory'
      }
    ]
  },
  {
    id: 'AST-1002',
    assetId: 'AST-1002',
    assetName: 'Lenovo ThinkPad T14 Gen 4',
    qrCode: 'AST-1002-QR',
    barcode: '8901234567891',
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'Lenovo',
    model: 'ThinkPad T14',
    serialNumber: 'LENV-RAD-4421',
    purchaseDate: '2025-03-20',
    purchaseCost: 92000,
    vendorId: 'VND-001',
    warrantyStart: '2025-03-20',
    warrantyExpiry: '2028-03-19',
    amc: 'Lenovo Premier Support',
    currentUserId: 'USR-010', // Rohan Shah
    currentUserName: 'Rohan Shah',
    departmentId: 'DEPT-001',
    locationId: 'LOC-006', // Radhu Factory
    locationName: 'Radhu Factory',
    allocationDate: '2026-03-01',
    status: 'Allocated',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-07-15',
    allocationHistory: [
      {
        id: 'ALH-102',
        type: 'Allocation',
        fromUserId: null,
        fromUserName: null,
        toUserId: 'USR-004',
        toUserName: 'Mithun Parmar',
        fromLocationId: null,
        fromLocationName: null,
        toLocationId: 'LOC-005',
        toLocationName: 'Aslali Factory',
        date: '2025-04-01',
        notes: 'Initial allocation at Aslali Factory'
      },
      {
        id: 'ALH-103',
        type: 'Reallocation',
        fromUserId: 'USR-004',
        fromUserName: 'Mithun Parmar',
        toUserId: 'USR-010',
        toUserName: 'Rohan Shah',
        fromLocationId: 'LOC-005',
        fromLocationName: 'Aslali Factory',
        toLocationId: 'LOC-006',
        toLocationName: 'Radhu Factory',
        date: '2026-03-01',
        notes: 'Reallocated to Rohan Shah for Radhu Factory IT deployment'
      }
    ]
  },
  {
    id: 'AST-1003',
    assetId: 'AST-1003',
    assetName: 'HP EliteBook 840 G10',
    qrCode: 'AST-1003-QR',
    barcode: '8901234567892',
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'HP',
    model: 'EliteBook 840 G10',
    serialNumber: 'HP-ASL-5510',
    purchaseDate: '2025-06-10',
    purchaseCost: 98000,
    vendorId: 'VND-001',
    warrantyStart: '2025-06-10',
    warrantyExpiry: '2028-06-09',
    amc: 'HP Care Pack',
    currentUserId: null,
    currentUserName: null,
    departmentId: 'DEPT-001',
    locationId: 'LOC-005', // Aslali Factory
    locationName: 'Aslali Factory',
    allocationDate: null,
    status: 'Available',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-01',
    allocationHistory: []
  },
  {
    id: 'AST-1004',
    assetId: 'AST-1004',
    assetName: 'Zebra ZT411 Industrial Label Printer',
    qrCode: 'AST-1004-QR',
    barcode: '8901234567893',
    assetType: 'Hardware',
    category: 'Printer',
    make: 'Zebra',
    model: 'ZT411',
    serialNumber: 'ZEB-RAD-3002',
    purchaseDate: '2024-11-05',
    purchaseCost: 120000,
    vendorId: 'VND-006',
    warrantyStart: '2024-11-05',
    warrantyExpiry: '2026-11-04',
    amc: 'Zebra OneCare',
    currentUserId: 'USR-011', // Arvind Patel
    currentUserName: 'Arvind Patel',
    departmentId: 'DEPT-001',
    locationId: 'LOC-006', // Radhu Factory
    locationName: 'Radhu Factory',
    allocationDate: '2026-02-15',
    status: 'Allocated',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-10',
    allocationHistory: [
      {
        id: 'ALH-104',
        type: 'Allocation',
        fromUserId: null,
        fromUserName: null,
        toUserId: 'USR-011',
        toUserName: 'Arvind Patel',
        fromLocationId: null,
        fromLocationName: null,
        toLocationId: 'LOC-006',
        toLocationName: 'Radhu Factory',
        date: '2026-02-15',
        notes: 'Allocated for Radhu Factory inventory dispatch desk'
      }
    ]
  },
  {
    id: 'AST-1005',
    assetId: 'AST-1005',
    assetName: 'Apple iPad Air M2 (Inventory Scanner)',
    qrCode: 'AST-1005-QR',
    barcode: '8901234567894',
    assetType: 'Hardware',
    category: 'Tablet',
    make: 'Apple',
    model: 'iPad Air 11" M2',
    serialNumber: 'APL-ASL-8820',
    purchaseDate: '2025-08-01',
    purchaseCost: 65000,
    vendorId: 'VND-001',
    warrantyStart: '2025-08-01',
    warrantyExpiry: '2027-07-31',
    amc: 'AppleCare+ for Business',
    currentUserId: null,
    currentUserName: null,
    departmentId: 'DEPT-002',
    locationId: 'LOC-005', // Aslali Factory
    locationName: 'Aslali Factory',
    allocationDate: null,
    status: 'Available',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-15',
    allocationHistory: []
  }
];

export const INITIAL_PROJECTS = [];
export const INITIAL_AGREEMENTS = [];
export const INITIAL_LICENSES = [];
export const INITIAL_STATIONERY = [];
export const INITIAL_EXPENSES = [];
export const INITIAL_INWARD = [];
export const INITIAL_OUTWARD = [];
export const INITIAL_COURIER = [];
export const INITIAL_MAINTENANCE = [];
export const INITIAL_FAQS = [];
export const INITIAL_AUDIT_LOGS = [];
export const INITIAL_NOTIFICATIONS = [];
