export const INITIAL_TICKETS = [
  {
    id: 'TKT-1001',
    ticketNumber: 'TKT-1001',
    ticketType: 'Maintenance',
    categoryId: 'CM-001',
    category: 'Facility / HVAC',
    subcategory: 'AC Unit',
    subject: 'Main Server Room Air Conditioner Cooling Failure',
    description: 'The split AC unit in the primary server room has stopped cooling. Temperature currently rising to 28°C.',
    requesterId: 'USR-004',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    priority: 'Critical',
    assignedTeamId: 'TEAM-003',
    assignedUserId: 'USR-005',
    assetId: 'AST-1004',
    slaHours: 4,
    status: 'In Progress',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [
      { id: 'ATT-1', fileName: 'ac_error_panel.jpg', fileType: 'image/jpeg', fileSize: '1.2 MB', uploadedAt: new Date().toISOString() }
    ],
    timeline: [
      { action: 'Ticket Created', user: 'Rahul Mehta', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), notes: 'Created via Employee Web Portal' },
      { action: 'Assigned to Team', user: 'System', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), notes: 'Auto-routed to Facility & HVAC Team' },
      { action: 'Technician Assigned', user: 'Ramesh Patel', timestamp: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(), notes: 'Assigned to Amit Joshi' },
      { action: 'Status Changed', user: 'Amit Joshi', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), notes: 'Status changed to In Progress. Inspecting AC gas compressor.' }
    ]
  },
  {
    id: 'TKT-1002',
    ticketNumber: 'TKT-1002',
    ticketType: 'IT',
    categoryId: 'CM-004',
    category: 'Network / Internet',
    subcategory: 'Wi-Fi & LAN',
    subject: '3rd Floor Wi-Fi Access Point Frequent Disconnections',
    description: 'Employees on the 3rd floor sales bay experiencing intermittent internet loss.',
    requesterId: 'USR-006',
    departmentId: 'DEPT-003',
    locationId: 'LOC-003',
    priority: 'High',
    assignedTeamId: 'TEAM-002',
    assignedUserId: 'USR-004',
    assetId: 'AST-1006',
    slaHours: 4,
    status: 'Open',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Neha Gupta', timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), notes: 'Created via Web Portal' }
    ]
  },
  {
    id: 'TKT-1003',
    ticketNumber: 'TKT-1003',
    ticketType: 'IT',
    categoryId: 'CM-003',
    category: 'IT & Hardware',
    subcategory: 'Laptop / Desktop',
    subject: 'New Developer Laptop Setup & Software Provisioning',
    description: 'Requesting MacBook Pro M3 configuration for new senior frontend engineer joining next Monday.',
    requesterId: 'USR-003',
    departmentId: 'DEPT-002',
    locationId: 'LOC-002',
    priority: 'Medium',
    assignedTeamId: 'TEAM-001',
    assignedUserId: 'USR-004',
    assetId: null,
    slaHours: 8,
    status: 'Resolved',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    resolution: 'Provisioned Asset AST-1001 with M3 Max, 32GB RAM, installed Docker, VS Code, and VPN credentials.',
    resolvedBy: 'Rahul Mehta',
    resolvedDate: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    feedbackRating: 5,
    feedbackComment: 'Prompt setup! Laptop ready before employee start date.',
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Priya Sharma', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), notes: 'Ticket raised' },
      { action: 'Resolved', user: 'Rahul Mehta', timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), notes: 'Laptop configured and allocated' }
    ]
  },
  {
    id: 'TKT-1004',
    ticketNumber: 'TKT-1004',
    ticketType: 'Maintenance',
    categoryId: 'CM-002',
    category: 'Power / Electrical',
    subcategory: 'UPS & Generator',
    subject: '100KVA UPS Battery Backup Warning Beep',
    description: 'UPS panel emitting battery fault alarm in server rack room B.',
    requesterId: 'USR-004',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    priority: 'High',
    assignedTeamId: 'TEAM-003',
    assignedUserId: 'USR-005',
    assetId: 'AST-1007',
    slaHours: 2,
    status: 'Breached',
    escalationLevel: 'Level 3',
    createdDate: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Rahul Mehta', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), notes: 'Ticket logged via Email' },
      { action: 'Escalated to Level 3', user: 'System SLA Evaluator', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), notes: 'SLA Breached by 2 hours. Escalated to Department Manager.' }
    ]
  },
  {
    id: 'TKT-1005',
    ticketNumber: 'TKT-1005',
    ticketType: 'Admin',
    categoryId: 'CM-005',
    category: 'Furniture',
    subcategory: 'Chair & Desk',
    subject: 'Ergonomic Desk Chair Pneumatic Height Cylinder Replacement',
    description: 'Chair cylinder sinks automatically when seated.',
    requesterId: 'USR-007',
    departmentId: 'DEPT-004',
    locationId: 'LOC-002',
    priority: 'Low',
    assignedTeamId: 'TEAM-004',
    assignedUserId: null,
    assetId: 'AST-1005',
    slaHours: 12,
    status: 'Open',
    escalationLevel: 'Level 1',
    createdDate: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 11 * 3600 * 1000).toISOString(),
    resolution: null,
    resolvedBy: null,
    resolvedDate: null,
    feedbackRating: null,
    feedbackComment: null,
    attachments: [],
    timeline: [
      { action: 'Ticket Created', user: 'Vikram Joshi', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), notes: 'Created via Web Portal' }
    ]
  }
];

export const INITIAL_ASSETS = [
  {
    id: 'AST-1001',
    assetId: 'AST-1001',
    qrCode: 'AST-1001-QR',
    barcode: '8901234567890',
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    serialNumber: 'C02G1234MD6R',
    purchaseDate: '2025-01-15',
    purchaseCost: 249900,
    vendorId: 'VND-001',
    warrantyStart: '2025-01-15',
    warrantyExpiry: '2028-01-14',
    amc: 'AppleCare+ Enterprise',
    currentUserId: 'USR-004',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    ipAddress: '192.168.1.104',
    macAddress: 'A4:83:E7:12:34:56',
    operatingSystem: 'macOS Sequoia 15.2',
    specifications: 'Apple M3 Max 16-Core CPU, 36-Core GPU, 36GB Unified Memory, 1TB SSD',
    status: 'In Use',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-07-01'
  },
  {
    id: 'AST-1002',
    assetId: 'AST-1002',
    qrCode: 'AST-1002-QR',
    barcode: '8901234567891',
    assetType: 'Hardware',
    category: 'Laptop',
    make: 'Dell',
    model: 'Latitude 7440 Ultrabook',
    serialNumber: 'DELL-LAT-88902',
    purchaseDate: '2024-06-10',
    purchaseCost: 115000,
    vendorId: 'VND-001',
    warrantyStart: '2024-06-10',
    warrantyExpiry: '2026-08-30',
    amc: 'Dell ProSupport Plus',
    currentUserId: 'USR-006',
    departmentId: 'DEPT-003',
    locationId: 'LOC-003',
    ipAddress: '192.168.3.45',
    macAddress: '3C:D9:2B:44:55:66',
    operatingSystem: 'Windows 11 Pro Enterprise',
    specifications: 'Intel Core i7 13th Gen, 16GB LPDDR5, 512GB NVMe SSD',
    status: 'In Use',
    verificationStatus: 'Pending Verification',
    lastVerifiedDate: '2026-02-15'
  },
  {
    id: 'AST-1003',
    assetId: 'AST-1003',
    qrCode: 'AST-1003-QR',
    barcode: '8901234567892',
    assetType: 'Hardware',
    category: 'Server',
    make: 'HPE',
    model: 'ProLiant DL380 Gen10 Plus',
    serialNumber: 'HPE-SRV-99011',
    purchaseDate: '2023-11-20',
    purchaseCost: 680000,
    vendorId: 'VND-001',
    warrantyStart: '2023-11-20',
    warrantyExpiry: '2026-11-19',
    amc: 'HPE Pointnext Tech Care',
    currentUserId: 'USR-001',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    ipAddress: '10.0.0.15',
    macAddress: '70:B5:E8:88:99:AA',
    operatingSystem: 'Ubuntu Server 24.04 LTS',
    specifications: 'Dual Intel Xeon Gold 6330, 256GB ECC DDR4, 4x 1.92TB NVMe RAID 10',
    status: 'In Use',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-08-01'
  },
  {
    id: 'AST-1004',
    assetId: 'AST-1004',
    qrCode: 'AST-1004-QR',
    barcode: '8901234567893',
    assetType: 'Other',
    category: 'Air Conditioner',
    make: 'Daikin',
    model: 'Precision Cooling 3.0 Ton Ductable Split',
    serialNumber: 'DAIKIN-HVAC-4421',
    purchaseDate: '2022-04-10',
    purchaseCost: 185000,
    vendorId: 'VND-002',
    warrantyStart: '2022-04-10',
    warrantyExpiry: '2025-04-09',
    amc: 'ChillAir Comprehensive AMC',
    currentUserId: null,
    departmentId: 'DEPT-006',
    locationId: 'LOC-001',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    operatingSystem: 'Embedded HVAC Controller',
    specifications: '36,000 BTU cooling, Inverter Compressor, R32 Eco Refrigerant',
    status: 'Under Repair',
    verificationStatus: 'Issue Found',
    lastVerifiedDate: '2026-08-10'
  },
  {
    id: 'AST-1005',
    assetId: 'AST-1005',
    qrCode: 'AST-1005-QR',
    barcode: '8901234567894',
    assetType: 'Peripheral',
    category: 'Ergonomic Chair',
    make: 'Herman Miller',
    model: 'Aeron Chair Size B',
    serialNumber: 'HM-AERON-2023-88',
    purchaseDate: '2023-08-15',
    purchaseCost: 128000,
    vendorId: 'VND-004',
    warrantyStart: '2023-08-15',
    warrantyExpiry: '2035-08-14',
    amc: 'Manufacturer 12-Year Warranty',
    currentUserId: 'USR-007',
    departmentId: 'DEPT-004',
    locationId: 'LOC-002',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    operatingSystem: 'N/A',
    specifications: 'Graphite Frame, Fully Adjustable Arms, PostureFit SL',
    status: 'In Use',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-05-10'
  },
  {
    id: 'AST-1006',
    assetId: 'AST-1006',
    qrCode: 'AST-1006-QR',
    barcode: '8901234567895',
    assetType: 'Network',
    category: 'Access Point',
    make: 'Cisco Meraki',
    model: 'MR46 Wi-Fi 6 Access Point',
    serialNumber: 'MERAKI-MR46-7781',
    purchaseDate: '2024-03-01',
    purchaseCost: 75000,
    vendorId: 'VND-001',
    warrantyStart: '2024-03-01',
    warrantyExpiry: '2027-02-28',
    amc: 'Enterprise Cloud License 3Yr',
    currentUserId: null,
    departmentId: 'DEPT-001',
    locationId: 'LOC-003',
    ipAddress: '10.0.3.50',
    macAddress: '00:18:0A:11:22:33',
    operatingSystem: 'Meraki Firmware v29',
    specifications: '4x4 MU-MIMO Wi-Fi 6, 3.5 Gbps Dual-concurrent Aggregate Frame Rate',
    status: 'In Stock',
    verificationStatus: 'Verified',
    lastVerifiedDate: '2026-06-20'
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'PRJ-001',
    projectCode: 'PRJ-001',
    projectName: 'HQ Data Center Cloud Migration & Security Hardening',
    ownerId: 'USR-008',
    vendorId: 'VND-001',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    targetDate: '2026-09-15',
    status: 'In Progress',
    progress: 70,
    budget: 1500000,
    spent: 980000,
    tasks: [
      { id: 'TSK-1', title: 'Audit current physical servers and virtual machines', assigneeId: 'USR-004', dueDate: '2026-05-20', priority: 'High', status: 'Completed' },
      { id: 'TSK-2', title: 'Provision AWS Frankfurt & Mumbai Region EC2 & RDS', assigneeId: 'USR-004', dueDate: '2026-06-30', priority: 'High', status: 'Completed' },
      { id: 'TSK-3', title: 'Migrate Oracle & Postgres databases with minimal downtime', assigneeId: 'USR-008', dueDate: '2026-08-25', priority: 'Critical', status: 'In Progress' },
      { id: 'TSK-4', title: 'Configure Cloudflare Zero Trust Access & WAF Rules', assigneeId: 'USR-004', dueDate: '2026-09-10', priority: 'High', status: 'Not Started' }
    ],
    milestones: [
      { title: 'Cloud Infrastructure Provisioned', date: '2026-06-30', status: 'Achieved' },
      { title: 'Database Live Switchover', date: '2026-08-30', status: 'Pending' },
      { title: 'Decommission Legacy On-Prem Servers', date: '2026-09-30', status: 'Pending' }
    ]
  },
  {
    id: 'PRJ-002',
    projectCode: 'PRJ-002',
    projectName: 'Ergonomic Office Workspace Redesign & Desk Expansion',
    ownerId: 'USR-003',
    vendorId: 'VND-004',
    departmentId: 'DEPT-002',
    locationId: 'LOC-002',
    startDate: '2026-07-10',
    endDate: '2026-10-15',
    targetDate: '2026-10-01',
    status: 'Planned',
    progress: 25,
    budget: 850000,
    spent: 210000,
    tasks: [
      { id: 'TSK-201', title: 'Finalize modular furniture layout drawing', assigneeId: 'USR-003', dueDate: '2026-07-25', priority: 'Medium', status: 'Completed' },
      { id: 'TSK-202', title: 'Issue PO for 50 Ergonomic Mesh Chairs & Standing Desks', assigneeId: 'USR-003', dueDate: '2026-08-15', priority: 'High', status: 'In Progress' }
    ],
    milestones: [
      { title: 'Furniture Procurement Approval', date: '2026-08-15', status: 'In Progress' },
      { title: 'Floor Installation Completed', date: '2026-09-30', status: 'Pending' }
    ]
  }
];

export const INITIAL_AGREEMENTS = [
  {
    id: 'AGR-001',
    agreementNumber: 'AGR-2025-HVAC-01',
    agreementType: 'AMC',
    vendorId: 'VND-002',
    title: 'Annual HVAC & Precision AC Maintenance Contract',
    startDate: '2025-09-01',
    expiryDate: '2026-08-31',
    contractValue: 350000,
    renewalDate: '2026-08-15',
    contactPerson: 'Manish Trivedi (+91 98250 11223)',
    status: 'Expiring Soon',
    documents: [{ name: 'hvac_amc_signed_contract.pdf', size: '2.4 MB' }]
  },
  {
    id: 'AGR-002',
    agreementNumber: 'AGR-2024-DELL-99',
    agreementType: 'Service Agreement',
    vendorId: 'VND-001',
    title: 'Enterprise Laptop ProSupport Hardware Coverage',
    startDate: '2024-01-01',
    expiryDate: '2027-12-31',
    contractValue: 1200000,
    renewalDate: '2027-11-30',
    contactPerson: 'Rajesh Shah (+91 98765 43210)',
    status: 'Active',
    documents: [{ name: 'dell_prosupport_master_sla.pdf', size: '1.8 MB' }]
  },
  {
    id: 'AGR-003',
    agreementNumber: 'AGR-2023-UPS-04',
    agreementType: 'AMC',
    vendorId: 'VND-003',
    title: '100KVA Central UPS Maintenance & Battery Replacement Contract',
    startDate: '2023-08-01',
    expiryDate: '2026-07-31',
    contractValue: 480000,
    renewalDate: '2026-07-15',
    contactPerson: 'Sunil Rao (+91 91234 56789)',
    status: 'Expired',
    documents: [{ name: 'powerguard_amc_2023_2026.pdf', size: '3.1 MB' }]
  }
];

export const INITIAL_LICENSES = [
  {
    id: 'LIC-001',
    softwareName: 'Microsoft 365 E5 Enterprise Suite',
    vendorId: 'VND-007',
    licenseType: 'Per User Subscription',
    totalQuantity: 200,
    usedQuantity: 184,
    availableQuantity: 16,
    purchaseDate: '2025-11-01',
    expiryDate: '2026-10-31',
    renewalDate: '2026-10-01',
    complianceStatus: 'Compliant',
    unitCost: 3200,
    totalCost: 640000,
    status: 'Active'
  },
  {
    id: 'LIC-002',
    softwareName: 'Adobe Creative Cloud All Apps',
    vendorId: 'VND-007',
    licenseType: 'Named User License',
    totalQuantity: 25,
    usedQuantity: 25,
    availableQuantity: 0,
    purchaseDate: '2025-09-15',
    expiryDate: '2026-09-14',
    renewalDate: '2026-08-25',
    complianceStatus: 'At Capacity',
    unitCost: 4500,
    totalCost: 112500,
    status: 'Expiring Soon'
  },
  {
    id: 'LIC-003',
    softwareName: 'JetBrains All Products Pack',
    vendorId: 'VND-007',
    licenseType: 'Commercial License',
    totalQuantity: 30,
    usedQuantity: 32,
    availableQuantity: -2,
    purchaseDate: '2025-03-10',
    expiryDate: '2026-03-09',
    renewalDate: '2026-02-20',
    complianceStatus: 'Compliance Issue (Overallocated)',
    unitCost: 6000,
    totalCost: 180000,
    status: 'Active'
  }
];

export const INITIAL_STATIONERY = [
  {
    id: 'STN-001',
    itemCode: 'STN-PAP-A4',
    description: 'JK Copier Paper A4 75 GSM (500 Sheets/Ream)',
    unit: 'Ream',
    openingStock: 100,
    stockIn: 50,
    stockOut: 135,
    currentStock: 15,
    reorderLevel: 25,
    minimumStock: 10,
    vendorId: 'VND-006',
    unitCost: 280,
    totalValue: 4200,
    status: 'Low Stock'
  },
  {
    id: 'STN-002',
    itemCode: 'STN-PEN-GEL',
    description: 'Uniball Jetstream Gel Pen 0.7mm (Blue)',
    unit: 'Box (10 Pcs)',
    openingStock: 50,
    stockIn: 30,
    stockOut: 45,
    currentStock: 35,
    reorderLevel: 15,
    minimumStock: 5,
    vendorId: 'VND-006',
    unitCost: 450,
    totalValue: 15750,
    status: 'Normal'
  },
  {
    id: 'STN-003',
    itemCode: 'STN-TNR-88A',
    description: 'HP 88A Black Original LaserJet Toner Cartridge',
    unit: 'Piece',
    openingStock: 10,
    stockIn: 5,
    stockOut: 13,
    currentStock: 2,
    reorderLevel: 4,
    minimumStock: 2,
    vendorId: 'VND-006',
    unitCost: 3850,
    totalValue: 7700,
    status: 'Low Stock'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'EXP-1001',
    expenseNumber: 'EXP-1001',
    date: '2026-08-05',
    module: 'Maintenance',
    category: 'Repairs & Servicing',
    vendorId: 'VND-002',
    departmentId: 'DEPT-006',
    locationId: 'LOC-001',
    projectId: null,
    assetId: 'AST-1004',
    amount: 24500,
    description: 'Emergency HVAC compressor gas refilling and motor capacitor replacement',
    status: 'Approved',
    approvedBy: 'USR-007'
  },
  {
    id: 'EXP-1002',
    expenseNumber: 'EXP-1002',
    date: '2026-08-01',
    module: 'Stationery',
    category: 'Office Supplies',
    vendorId: 'VND-006',
    departmentId: 'DEPT-002',
    locationId: 'LOC-001',
    projectId: null,
    assetId: null,
    amount: 32500,
    description: 'Monthly office stationery reorder (Paper reams, pens, toners, sticky notes)',
    status: 'Approved',
    approvedBy: 'USR-007'
  },
  {
    id: 'EXP-1003',
    expenseNumber: 'EXP-1003',
    date: '2026-07-28',
    module: 'Projects',
    category: 'Cloud Infrastructure',
    vendorId: 'VND-001',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    projectId: 'PRJ-001',
    assetId: null,
    amount: 180000,
    description: 'AWS Enterprise Support & DirectConnect Express Gateway Installation',
    status: 'Approved',
    approvedBy: 'USR-007'
  }
];

export const INITIAL_INWARD = [
  {
    id: 'INW-001',
    inwardNumber: 'INW-2026-089',
    date: '2026-08-09',
    receivedFrom: 'TechCorp Solutions Pvt Ltd',
    receivedByUserId: 'USR-009',
    departmentId: 'DEPT-001',
    purpose: 'New Batch MacBook Pro Delivery',
    materialDescription: '5 Box MacBook Pro M3 Laptops with Chargers & Warranty Cards',
    approvalStatus: 'Approved',
    courierTrackingId: 'AWB-8899120'
  }
];

export const INITIAL_OUTWARD = [
  {
    id: 'OUT-001',
    outwardNumber: 'OUT-2026-042',
    date: '2026-08-08',
    sentTo: 'Regional Office (Delhi NCR)',
    approvedByUserId: 'USR-003',
    departmentId: 'DEPT-002',
    purpose: 'Inter-office Confidential Audit Files Transfer',
    materialDescription: '2 Sealed Boxes contain Q2 Financial Audit Ledgers',
    dispatchStatus: 'Dispatched',
    courierTrackingId: 'AWB-9988112'
  }
];

export const INITIAL_COURIER = [
  {
    id: 'COU-001',
    courierCompany: 'SwiftCourier Logistics',
    awbNumber: 'AWB-9988112',
    senderId: 'USR-003',
    receiverName: 'Amitabh Roy',
    type: 'Outward Document',
    dispatchDate: '2026-08-08',
    expectedDelivery: '2026-08-11',
    currentStatus: 'In Transit',
    courierCost: 1450,
    proofOfDelivery: null,
    timeline: [
      { status: 'Booked', timestamp: '2026-08-08 10:30 AM', location: 'Mumbai HQ' },
      { status: 'Picked Up', timestamp: '2026-08-08 02:00 PM', location: 'Mumbai Central Hub' },
      { status: 'In Transit', timestamp: '2026-08-09 08:15 AM', location: 'En-route to Delhi NCR Hub' }
    ]
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'MNT-001',
    requestNumber: 'MNT-2026-015',
    requestDate: '2026-08-08',
    category: 'AC / HVAC',
    assetId: 'AST-1004',
    title: 'Server Room Precision AC Refrigerant Leak Fix',
    description: 'Compressor low gas pressure alert. ChillAir engineer dispatched.',
    vendorId: 'VND-002',
    technicianId: 'USR-005',
    estimatedCost: 25000,
    actualCost: 24500,
    status: 'In Progress',
    notes: 'Technician on-site repairing copper pipe braze joint.'
  }
];

export const INITIAL_FAQS = [
  {
    id: 'FAQ-001',
    category: 'Network & Connectivity',
    question: 'How do I resolve Wi-Fi disconnections on corporate laptops?',
    answer: '1. Click on Wi-Fi settings and choose Forget Enterprise-Secure SSID.\n2. Re-select Enterprise-Secure network.\n3. Enter your domain username and updated password.\n4. If issue persists, flush DNS using command prompt: ipconfig /flushdns.',
    helpfulCount: 42,
    unhelpfulCount: 2
  },
  {
    id: 'FAQ-002',
    category: 'Hardware & Laptop',
    question: 'What is the standard process to request an external monitor or docking station?',
    answer: 'Navigate to IT Assets → Request Allocation, select Desktop Accessory, and submit line-manager approval. Standard approvals take 24-48 hours.',
    helpfulCount: 28,
    unhelpfulCount: 1
  },
  {
    id: 'FAQ-003',
    category: 'Facility & Office',
    question: 'How do I schedule maintenance for office AC or seating issues?',
    answer: 'Submit an Admin & Maintenance ticket selecting Category Facility / HVAC or Seating. The complaint matrix auto-assigns the Facility Team with a 4-12 hour SLA.',
    helpfulCount: 35,
    unhelpfulCount: 0
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-001',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    user: 'Rahul Mehta',
    role: 'IT Admin',
    module: 'Ticketing',
    action: 'CREATE',
    recordId: 'TKT-1001',
    description: 'Created ticket TKT-1001 for Server Room AC Failure with SLA of 4 Hours',
    previousValue: null,
    newValue: 'Status: In Progress'
  },
  {
    id: 'LOG-002',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    user: 'System Administrator',
    role: 'Super Admin',
    module: 'Asset Management',
    action: 'TRANSFER',
    recordId: 'AST-1001',
    description: 'Allocated MacBook Pro AST-1001 to user Rahul Mehta (IT Dept)',
    previousValue: 'User: Unassigned',
    newValue: 'User: Rahul Mehta'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    notificationKey: 'SLA_BREACH_TKT-1004_100%',
    type: 'SLA Alert',
    title: 'SLA Breached: Ticket TKT-1004',
    message: 'UPS Battery Warning ticket TKT-1004 has breached its 2-hour SLA target.',
    priority: 'Critical',
    read: false,
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    linkRoute: '/tickets'
  },
  {
    id: 'NOTIF-002',
    notificationKey: 'STATIONERY_LOW_STOCK_STN-001_THRESHOLD',
    type: 'Low Stock Alert',
    title: 'Low Stock: JK Copier A4 Paper',
    message: 'Current stock for JK Copier Paper A4 is 15 Reams (Reorder level: 25 Reams).',
    priority: 'Warning',
    read: false,
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    linkRoute: '/stationery'
  },
  {
    id: 'NOTIF-003',
    notificationKey: 'AGREEMENT_EXPIRY_AGR-001_15DAYS',
    type: 'Renewal Reminder',
    title: 'Agreement Expiring Soon: AGR-2025-HVAC-01',
    message: 'ChillAir HVAC AMC agreement expires on 31/08/2026.',
    priority: 'Medium',
    read: true,
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    linkRoute: '/agreements'
  }
];
