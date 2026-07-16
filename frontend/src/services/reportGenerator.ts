import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (data: any[], filename: string, title: string = 'Report') => {
  const doc = new jsPDF();
  
  // Header: Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('OrbitOps', 14, 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Space Systems & Mission Control', 14, 26);

  // Horizontal Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);

  // Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(title.toUpperCase(), 14, 42);
  
  // Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 48);
  doc.text(`Total Records: ${data ? data.length : 0}`, 14, 53);
  doc.text(`Classification: INTERNAL USE ONLY`, 14, 58);
  
  if (!data || data.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No data available for this report.', 14, 70);
    doc.save(`${filename}.pdf`);
    return;
  }

  // Column Selection & Formatting
  // For missions, let's pick the most useful columns to avoid clutter
  let keys = Object.keys(data[0]).filter(k => k !== 'id' && typeof data[0][k] !== 'object' && k !== 'description');
  
  // If there are too many columns, limit them to ensure readability
  if (keys.length > 7) {
    const preferredKeys = ['name', 'satellite', 'status', 'priority', 'startTime', 'endTime', 'estimatedDuration'];
    const availablePreferred = preferredKeys.filter(k => keys.includes(k));
    if (availablePreferred.length > 0) {
      keys = availablePreferred;
    }
  }
  
  const head = [keys.map(k => {
    let formatted = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1').trim();
    if (k === 'estimatedDuration') formatted = 'Duration (min)';
    return formatted;
  })];

  const body = data.map(item => keys.map(k => {
    const val = item[k];
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (val instanceof Date) return val.toLocaleString();
    // Check if it's an ISO date string
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      return new Date(val).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    }
    return String(val);
  }));

  autoTable(doc, {
    startY: 65,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { 
      fillColor: [241, 245, 249], // slate-100
      textColor: [15, 23, 42],    // slate-900
      fontStyle: 'bold',
      lineColor: [203, 213, 225], // slate-300
      lineWidth: 0.1,
    },
    bodyStyles: {
      textColor: [51, 65, 85],    // slate-700
      lineColor: [226, 232, 240], // slate-200
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    styles: { 
      font: 'helvetica',
      fontSize: 8, 
      cellPadding: 4 
    },
    margin: { top: 15, right: 14, bottom: 15, left: 14 },
    didDrawPage: function (data: any) {
      // Footer
      const str = 'Page ' + (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    }
  });

  doc.save(`${filename}.pdf`);
};
