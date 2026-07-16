import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (data: any[], filename: string, title: string = 'Report') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Subtitle/Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  if (!data || data.length === 0) {
    doc.text('No data available.', 14, 40);
    doc.save(`${filename}.pdf`);
    return;
  }

  // Extract keys for table headers
  const keys = Object.keys(data[0]).filter(k => k !== 'id' && typeof data[0][k] !== 'object');
  
  const head = [keys.map(k => k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1').trim())];
  const body = data.map(item => keys.map(k => {
    const val = item[k];
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (val instanceof Date) return val.toLocaleString();
    return String(val);
  }));

  autoTable(doc, {
    startY: 35,
    head: head,
    body: body,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] }, // sky-500
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { top: 10, right: 10, bottom: 10, left: 10 }
  });

  doc.save(`${filename}.pdf`);
};
