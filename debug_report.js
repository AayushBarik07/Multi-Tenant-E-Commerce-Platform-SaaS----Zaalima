const fs = require('fs');
let c = fs.readFileSync('server/controllers/reportController.js', 'utf8');

c = c.replace(
  "console.error('Error generating vendor report:', error);",
  "console.error('Error generating vendor report:', error);\n    require('fs').appendFileSync('vendor_report_error.log', new Date().toISOString() + ' ' + error.stack + '\\n');"
);

c = c.replace(
  "console.error('Error generating admin report:', error);",
  "console.error('Error generating admin report:', error);\n    require('fs').appendFileSync('admin_report_error.log', new Date().toISOString() + ' ' + error.stack + '\\n');"
);

fs.writeFileSync('server/controllers/reportController.js', c);
console.log('Added logging to reportController');
