const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

c = c.replace(
  '<button \n                  onClick={() => dispatch(toggleCart())}',
  `{(!dbUser || dbUser.role !== 'SUPER_ADMIN') && (
                <button \n                  onClick={() => dispatch(toggleCart())}`
);

c = c.replace(
  '                  )}
                </button>',
  `                  )}
                </button>
              )}`
);

fs.writeFileSync('client/src/App.jsx', c);
console.log('App.jsx updated');
