const fs = require('fs');

const addCursorPointer = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add cursor-pointer to buttons
  content = content.replace(/<button(\s+[^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('cursor-pointer')) {
      return `<button${p1}className="cursor-pointer ${p2}"`;
    }
    return match;
  });
  
  // Add cursor-pointer to any a tags just in case
  content = content.replace(/<a(\s+[^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('cursor-pointer')) {
      return `<a${p1}className="cursor-pointer ${p2}"`;
    }
    return match;
  });

  // Add cursor-pointer to Link tags just in case
  content = content.replace(/<Link(\s+[^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('cursor-pointer')) {
      return `<Link${p1}className="cursor-pointer ${p2}"`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
};

const filesToUpdate = [
  'client/src/components/Header.jsx',
  'client/src/components/ProductCard.jsx',
  'client/src/pages/public/Home.jsx',
  'client/src/pages/customer/Wishlist.jsx'
];

filesToUpdate.forEach(addCursorPointer);
