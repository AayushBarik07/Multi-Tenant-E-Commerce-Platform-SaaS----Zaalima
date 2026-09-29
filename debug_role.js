const fs = require('fs');
let c = fs.readFileSync('server/middleware/roleMiddleware.js', 'utf8');

c = c.replace(
  "console.error('Role middleware error:', error);",
  "console.error('Role middleware error:', error);\n      require('fs').appendFileSync('role_error.log', new Date().toISOString() + ' ' + error.stack + '\\n');"
);

fs.writeFileSync('server/middleware/roleMiddleware.js', c);
console.log('Added error logging to roleMiddleware');
