const fs = require('fs');

function unescapeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\\\`/g, '`');
  content = content.replace(/\\\$\{/g, '${');
  // Also look at AdminPayouts line 64:  ,1{parseFloat(payout.amount).toFixed(2)}
  // I'll replace ,1 with ₹
  content = content.replace(/,1/g, '₹');
  fs.writeFileSync(filePath, content);
  console.log(`Fixed syntax in ${filePath}`);
}

unescapeFile('client/src/pages/admin/AdminPayouts.jsx');
unescapeFile('client/src/pages/vendor/VendorWallet.jsx');
