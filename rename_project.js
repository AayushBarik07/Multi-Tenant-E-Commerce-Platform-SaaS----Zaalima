const fs = require('fs');
const path = require('path');

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        walkAndReplace(fullPath);
      }
    } else if (fullPath.match(/\.(js|jsx|html|md|css)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('Zaalima') || content.includes('OmniStore')) {
        console.log('Updating:', fullPath);
        content = content.replace(/Zaalima/g, 'EComVerse');
        content = content.replace(/OmniStore/g, 'EComVerse');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

walkAndReplace(path.join(__dirname, 'client'));
walkAndReplace(path.join(__dirname, 'server'));

let readme = fs.readFileSync('README.md', 'utf8');
if (readme.includes('Zaalima') || readme.includes('OmniStore')) {
  console.log('Updating README.md');
  readme = readme.replace(/Zaalima/g, 'EComVerse');
  readme = readme.replace(/OmniStore/g, 'EComVerse');
  fs.writeFileSync('README.md', readme);
}

console.log('Done replacing names!');
