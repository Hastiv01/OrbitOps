const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix addNotification to addToast
  content = content.replace(/const \{ addNotification \} = useNotification\(\);/g, 'const { addToast } = useNotification();');
  
  // Fix addNotification calls which I wrote as addNotification(Title, Message, type)
  // I need to change it to addToast(Message, type)
  // e.g. addNotification('Success', 'Payload assignment initiated', 'success')
  // -> addToast('Payload assignment initiated', 'success')
  content = content.replace(/addNotification\('[^']+', '([^']+)', '([^']+)'\)/g, "addToast('$1', '$2')");
  content = content.replace(/addNotification\('[^']+', `([^`]+)`, '([^']+)'\)/g, "addToast(`$1`, '$2')");

  // Fix Settings toggleTheme
  // <button onClick={() => setDarkMode(!darkMode)}
  // wait, the script did: {toggleSwitch(darkMode, () => setDarkMode(!darkMode))}
  // I mapped setDarkMode to toggleTheme: const { isDarkMode: darkMode, toggleTheme: setDarkMode } = useTheme();
  // So setDarkMode(!darkMode) is calling toggleTheme(!darkMode) which expects 0 args.
  content = content.replace(/\(\) => setDarkMode\(!darkMode\)/g, "() => setDarkMode()");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    processFile(path.join(pagesDir, file));
  }
}
console.log('Fixed typescript errors.');
