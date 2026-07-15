const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Global Light Theme Fixes

  // 1. Convert any rogue dark-only backgrounds that are bleeding into light mode
  // e.g. bg-slate-950/70 or bg-slate-950/60 (without dark: prefix)
  content = content.replace(/(?<!dark:)bg-slate-950\/[0-9]+/g, 'bg-white dark:$&');

  // 2. Standardize Cards (White in Light Theme, Slate 800 in Dark Theme)
  // bg-white dark:bg-white/10 -> bg-white dark:bg-slate-800
  content = content.replace(/dark:bg-white\/10/g, 'dark:bg-slate-800');
  
  // Replace dark:bg-slate-950/60 which looks bad with dark:bg-slate-800/80
  content = content.replace(/dark:bg-slate-950\/60/g, 'dark:bg-slate-800/80');

  // Replace dark:border-white/10 with dark:border-slate-700
  content = content.replace(/dark:border-white\/10/g, 'dark:border-slate-700');

  // 3. Select Dropdowns and Options in Dark Theme
  // Make sure they have solid backgrounds
  content = content.replace(/dark:bg-white\/5/g, 'dark:bg-slate-800');
  content = content.replace(/dark:bg-slate-900/g, 'dark:bg-slate-800');

  // 4. Text Contrast
  // Ensure all labels/body text in light theme are clearly slate-600 (not slate-500 which is low contrast)
  content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-600 dark:text-slate-400');

  // If the file changed, overwrite it
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

processDirectory(path.join(__dirname, 'src', 'pages'));
processDirectory(path.join(__dirname, 'src', 'components'));
processDirectory(path.join(__dirname, 'src', 'layouts'));

console.log('Finished UI Redesign mass replacement.');
