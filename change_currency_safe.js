const fs = require('fs');
const path = require('path');

function replaceCurrencySafe(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceCurrencySafe(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace >$ with >₹ (JSX text)
      let newContent = content.replace(/>\$/g, '>₹');
      // Replace `$ ` with `₹ ` inside strings (like 'Price: $ ')
      newContent = newContent.replace(/Price: \$/g, 'Price: ₹');
      newContent = newContent.replace(/Total: \$/g, 'Total: ₹');
      newContent = newContent.replace(/Revenue: \$/g, 'Revenue: ₹');
      // Replace \${ (escaped dollar in template string representing UI, e.g. \${price})
      newContent = newContent.replace(/\\\$\\\{/g, '₹\\{'); // Wait, if it was \${ in source
      newContent = newContent.replace(/\\\$\{/g, '₹{'); 
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated safely ${fullPath}`);
      }
    }
  }
}

replaceCurrencySafe('client/src');
