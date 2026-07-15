const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const replacements = [
  // Backgrounds
  { pattern: /bg-white\/10(?!\])/g, replacement: 'bg-white dark:bg-white/10 print:bg-white' },
  { pattern: /bg-white\/5(?!\])/g, replacement: 'bg-white dark:bg-white/5' },
  
  // Borders
  { pattern: /border-white\/10(?!\])/g, replacement: 'border-slate-200 dark:border-white/10 print:border-slate-300' },
  
  // Text Colors
  { pattern: /text-white(?!\])/g, replacement: 'text-slate-900 dark:text-white print:text-black' },
  { pattern: /text-slate-400(?!\])/g, replacement: 'text-slate-500 dark:text-slate-400 print:text-slate-700' },
  { pattern: /text-slate-300(?!\])/g, replacement: 'text-slate-600 dark:text-slate-300 print:text-slate-800' },
  { pattern: /text-slate-200(?!\])/g, replacement: 'text-slate-700 dark:text-slate-200 print:text-black' },
  { pattern: /text-sky-300(?!\])/g, replacement: 'text-sky-600 dark:text-sky-300 print:text-black' },
  
  // Shadows
  { pattern: /shadow-glow(?!\])/g, replacement: 'shadow-sm dark:shadow-glow print:shadow-none' },

  // Inputs
  { pattern: /placeholder-slate-500(?!\])/g, replacement: 'placeholder-slate-400 dark:placeholder-slate-500' },
  
  // Divide
  { pattern: /divide-white\/5(?!\])/g, replacement: 'divide-slate-200 dark:divide-white/5 print:divide-slate-300' },
  { pattern: /divide-white\/10(?!\])/g, replacement: 'divide-slate-200 dark:divide-white/10 print:divide-slate-300' },
  
  // Hover Backgrounds
  { pattern: /hover:bg-white\/5(?!\])/g, replacement: 'hover:bg-slate-50 dark:hover:bg-white/5' },
  { pattern: /hover:bg-white\/10(?!\])/g, replacement: 'hover:bg-slate-50 dark:hover:bg-white/10' },
];

// To avoid duplicate replacements if run multiple times, check if it's already responsive:
const alreadyReplaced = /dark:text-white|dark:bg-white\/10|dark:border-white\/10/;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (alreadyReplaced.test(content)) {
    console.log(`Skipping (already processed): ${path.basename(filePath)}`);
    return;
  }

  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${path.basename(filePath)}`);
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
// Also apply to global features and battery status and dashboard cards etc inside components
const componentsDir = path.join(__dirname, 'src', 'components');
processDirectory(componentsDir);

console.log('Theme class replacements complete.');
