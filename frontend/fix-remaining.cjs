const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// Helper to replace content
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix select menus: dark:bg-white/5 on selects causes unreadable options in dark mode on some browsers
  content = content.replace(/<select([^>]*)dark:bg-white\/5([^>]*)>/g, '<select$1dark:bg-slate-900$2>');
  // Also ensure options have a readable background if needed (usually handled by the select's bg)
  content = content.replace(/<option value="([^"]*)">/g, '<option value="$1" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">');
  content = content.replace(/<option value="">/g, '<option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">');

  // PayloadPlanner specific fixes
  if (path.basename(filePath) === 'PayloadPlanner.tsx') {
    // Add useNotification and useNavigate
    if (!content.includes('useNotification')) {
      content = content.replace(/import \{ useExport \} from '\.\.\/hooks';/, "import { useExport, useNotification } from '../hooks';\nimport { useNavigate } from 'react-router-dom';");
      content = content.replace(/const { exportToCSV, exportToJSON } = useExport\(\);/, "const { exportToCSV, exportToJSON } = useExport();\n  const { addNotification } = useNotification();\n  const navigate = useNavigate();");
    }

    // Fix buttons
    content = content.replace(/<Button variant="primary" icon={<FiCpu \/>}>Assign Payload<\/Button>/, '<Button variant="primary" icon={<FiCpu />} onClick={() => addNotification(\'Success\', \'Payload assignment initiated\', \'success\')}>Assign Payload</Button>');
    content = content.replace(/<Button variant="secondary" icon={<FiClock \/>}>Schedule Payload<\/Button>/, '<Button variant="secondary" icon={<FiClock />} onClick={() => navigate(\'/scheduler\')}>Schedule Payload</Button>');
    content = content.replace(/<Button variant="secondary" icon={<FiTool \/>}>Request Maintenance<\/Button>/, '<Button variant="secondary" icon={<FiTool />} onClick={() => addNotification(\'Maintenance\', \'Maintenance request submitted\', \'info\')}>Request Maintenance</Button>');
    
    // Add notifications to exports
    content = content.replace(/onClick=\{\(\) => exportToCSV\(payloadPlannerData, 'payloads'\)\}/, "onClick={() => { exportToCSV(payloadPlannerData, 'payloads'); addNotification('Exported', 'CSV file downloaded successfully', 'success'); }}");
    content = content.replace(/onClick=\{\(\) => exportToJSON\(payloadPlannerData, 'payloads'\)\}/, "onClick={() => { exportToJSON(payloadPlannerData, 'payloads'); addNotification('Exported', 'JSON file downloaded successfully', 'success'); }}");
  }

  // Settings specific fixes
  if (path.basename(filePath) === 'Settings.tsx') {
    // Add useNotification and useTheme
    if (!content.includes('useTheme')) {
      content = content.replace(/import \{ systemLogs \} from '\.\.\/data\/extendedMockData';/, "import { systemLogs } from '../data/extendedMockData';\nimport { useTheme, useNotification } from '../hooks';");
      content = content.replace(/const \[darkMode, setDarkMode\] = useState\(true\);/, "const { isDarkMode: darkMode, toggleTheme: setDarkMode } = useTheme();\n  const { addNotification } = useNotification();");
    }

    // Hook up Save Profile
    content = content.replace(/<Button variant="primary" icon=\{<FiSave \/>\}>Save Profile<\/Button>/, "<Button variant=\"primary\" icon={<FiSave />} onClick={() => addNotification('Profile Saved', 'Your settings have been updated successfully.', 'success')}>Save Profile</Button>");

    // Hook up API Config Save
    content = content.replace(/<Button variant="primary" icon=\{<FiSave \/>\}>Save Configuration<\/Button>/, "<Button variant=\"primary\" icon={<FiSave />} onClick={() => addNotification('Configuration Saved', 'API settings updated.', 'success')}>Save Configuration</Button>");

    // Hook up toggle notifications
    content = content.replace(/setNotifications\(prev => \(\{ \.\.\.prev, \[item\.key\]: !prev\[item\.key\] \}\)\)/, "() => { setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] })); addNotification('Settings Updated', `Notification preference changed.`, 'info'); }");
    
    // Hook up monitoring toggles
    content = content.replace(/setSatMonitoring\(prev => \(\{ \.\.\.prev, \[s\.id\]: !prev\[s\.id\] \}\)\)/, "() => { setSatMonitoring(prev => ({ ...prev, [s.id]: !prev[s.id] })); addNotification('Monitoring Updated', `Satellite monitoring preference changed.`, 'info'); }");
    content = content.replace(/setGsMonitoring\(prev => \(\{ \.\.\.prev, \[g\.id\]: !prev\[g\.id\] \}\)\)/, "() => { setGsMonitoring(prev => ({ ...prev, [g.id]: !prev[g.id] })); addNotification('Monitoring Updated', `Ground station monitoring preference changed.`, 'info'); }");
  }

  // Fix Light Theme invisible text with black background issue (user says "in light theme some part havinh black backgroud and text doesn't visible")
  // The script previously applied `bg-slate-950/60` and `bg-slate-950/40` unconditionally. Wait, in MissionScheduler I fixed it. Let's fix it everywhere.
  content = content.replace(/bg-slate-950\/40(?! print)/g, 'bg-slate-50 dark:bg-slate-950/40 print:bg-white');
  content = content.replace(/bg-slate-950\/50(?! print)/g, 'bg-slate-50 dark:bg-slate-950/50 print:bg-white');
  content = content.replace(/bg-slate-950\/60(?! print)/g, 'bg-slate-50 dark:bg-slate-950/60 print:bg-white');
  
  // Dedup if I accidentally created duplicate classes like `bg-slate-50 dark:bg-slate-50 dark:bg-slate-950/60`
  content = content.replace(/bg-slate-50 dark:bg-slate-50 dark:bg-slate-950\/(40|50|60) print:bg-white print:bg-white/g, 'bg-slate-50 dark:bg-slate-950/$1 print:bg-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

processDirectory(pagesDir);
processDirectory(path.join(__dirname, 'src', 'components'));

console.log('Final fixes applied.');
