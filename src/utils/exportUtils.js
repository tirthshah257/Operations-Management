import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Data') => {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
};

export const exportToPDF = (headers, rows, title = 'Export Report', filename = 'report.pdf') => {
  const doc = new jsPDF();
  
  // Title Header
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(filename);
};
