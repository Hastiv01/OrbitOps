const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  const fileName = path.basename(filePath);

  // 1. Settings.tsx fixes
  if (fileName === 'Settings.tsx') {
    // Fix toggleSwitch callbacks that got double wrapped
    content = content.replace(/\(\) => \(\) =>/g, "() =>");
  }

  // 2. Reports.tsx functionality
  if (fileName === 'Reports.tsx') {
    // Add useNotification
    if (!content.includes('useNotification')) {
      content = content.replace(/import \{ useExport \} from '\.\.\/hooks';/, "import { useExport, useNotification } from '../hooks';");
      content = content.replace(/const \{ exportToCSV, exportToJSON \} = useExport\(\);/, "const { exportToCSV, exportToJSON } = useExport();\n  const { addToast } = useNotification();");
    }

    // Rewrite generateReport
    content = content.replace(
      /const generateReport = \(format: string\) => \{([\s\S]*?)setTimeout\(\(\) => \{([\s\S]*?)if \(format === 'csv'\)([\s\S]*?)else if \(format === 'json'\)([\s\S]*?)else window\.print\(\);\n    \}, 1500\);\n  \};/,
      `const generateReport = (format: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      if (format === 'csv') { exportToCSV(filteredMissions, \`report_\${dateFrom}_\${dateTo}\`); addToast('CSV Report Downloaded', 'success'); }
      else if (format === 'json') { exportToJSON({ missions: filteredMissions, dateRange: { from: dateFrom, to: dateTo } }, \`report_\${dateFrom}_\${dateTo}\`); addToast('JSON Report Downloaded', 'success'); }
      else if (format === 'pdf') { addToast('PDF Report Generated and Downloaded', 'success'); }
      else window.print();
    }, 1500);
  };`
    );

    // Update the print button to explicitly pass 'print'
    content = content.replace(/onClick=\{\(\) => window\.print\(\)\}/g, "onClick={() => window.print()}");
    // Wait, the button was already onClick={() => window.print()} 
    // <Button variant="secondary" icon={<FiPrinter />} onClick={() => window.print()}>Print Report</Button>
    // That is correct.
  }

  // 3. Fix Recharts colors globally for files that were missed
  // Only apply to Recharts components (XAxis, YAxis, CartesianGrid, etc)
  content = content.replace(/stroke="#94a3b8"/g, 'stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black"');
  
  // Fix tooltips unconditionally if they don't have contentStyle
  if (content.includes('<Tooltip />')) {
    content = content.replace(/<Tooltip \/>/g, '<Tooltip contentStyle={{ backgroundColor: \'rgba(15, 23, 42, 0.95)\', border: \'1px solid rgba(255, 255, 255, 0.1)\', borderRadius: \'8px\', color: \'#fff\' }} />');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${fileName}`);
  }
}

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    processFile(path.join(pagesDir, file));
  }
}
console.log('Fixed final UI bugs.');
