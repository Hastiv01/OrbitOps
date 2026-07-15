import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

const replacements = [
  // Dashboard Quick Actions onClick
  { 
    pattern: /<Button variant="primary" size="md" icon={<FiZap \/>}>Run Optimization<\/Button>/g, 
    replacement: '<Button variant="primary" size="md" icon={<FiZap />} onClick={() => navigate(\'/optimization\')}>Run Optimization</Button>' 
  },
  { 
    pattern: /<Button variant="secondary" size="md" icon={<FiPlus \/>}>Create Mission<\/Button>/g, 
    replacement: '<Button variant="secondary" size="md" icon={<FiPlus />} onClick={() => navigate(\'/missions\')}>Create Mission</Button>' 
  },
  { 
    pattern: /<Button variant="secondary" size="md" icon={<FiFileText \/>}>Generate Report<\/Button>/g, 
    replacement: '<Button variant="secondary" size="md" icon={<FiFileText />} onClick={() => navigate(\'/reports\')}>Generate Report</Button>' 
  },
  { 
    pattern: /<Button variant="secondary" size="md" icon={<FiCalendar \/>}>Open Scheduler<\/Button>/g, 
    replacement: '<Button variant="secondary" size="md" icon={<FiCalendar />} onClick={() => navigate(\'/scheduler\')}>Open Scheduler</Button>' 
  },

  // MissionScheduler Schedule Mission onClick
  { 
    pattern: /<Button variant="primary" icon={<FiPlus \/>}>Schedule Mission<\/Button>/g, 
    replacement: '<Button variant="primary" icon={<FiPlus />} onClick={() => navigate(\'/missions\')}>Schedule Mission</Button>' 
  },

  // Fix Calendar UI Backgrounds
  { pattern: /bg-slate-950\/40/g, replacement: 'bg-slate-50 dark:bg-slate-950/40 print:bg-white' },
  { pattern: /bg-slate-950\/50/g, replacement: 'bg-slate-50 dark:bg-slate-950/50 print:bg-white' },
  { pattern: /bg-slate-950\/60/g, replacement: 'bg-slate-50 dark:bg-slate-950/60 print:bg-white' },

  // Add useNavigate hook if absent and needed
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  // Inject useNavigate to Dashboard and MissionScheduler
  if (content !== original) {
    if (path.basename(filePath) === 'Dashboard.tsx' || path.basename(filePath) === 'MissionScheduler.tsx') {
      if (!content.includes('useNavigate')) {
        content = content.replace(/import \{ useState/, 'import { useState } from \'react\';\nimport { useNavigate } from \'react-router-dom\';\n//');
        content = content.replace(/const \[scheduleSearch/, 'const navigate = useNavigate();\n  const [scheduleSearch');
        content = content.replace(/const \[search/, 'const navigate = useNavigate();\n  const [search');
      }
      
      // Fix inline chart colors for Recharts in Dashboard and MissionScheduler
      content = content.replace(/stroke="#94a3b8"/g, 'stroke="currentColor" className="text-slate-500 dark:text-slate-400 print:text-black"');
      content = content.replace(/<Tooltip \/>/g, '<Tooltip contentStyle={{ backgroundColor: \'rgba(15, 23, 42, 0.95)\', border: \'1px solid rgba(255, 255, 255, 0.1)\', borderRadius: \'8px\', color: \'#fff\' }} />');
    }

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

console.log('Fixes applied.');
