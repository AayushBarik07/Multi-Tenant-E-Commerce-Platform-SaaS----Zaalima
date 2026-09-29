const fs = require('fs');
const path = require('path');

function fixAllCurrencies(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixAllCurrencies(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix encoding issue
      let newContent = content.replace(/,1/g, '₹');
      newContent = newContent.replace(/,1\{parseFloat/g, '₹{parseFloat');
      
      // Fix lingering dollar signs before brackets
      newContent = newContent.replace(/\$\{parseFloat/g, '₹{parseFloat');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed currency in ${fullPath}`);
      }
    }
  }
}

fixAllCurrencies('client/src');
