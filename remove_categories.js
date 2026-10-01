const fs = require('fs');

let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

c = c.replace(
    "const categories = ['MEN', 'WOMEN', 'KIDS', 'HOME', 'BEAUTY', 'GENZ', 'STUDIO'];",
    "const categories = ['MEN', 'WOMEN', 'KIDS', 'HOME', 'BEAUTY'];"
);

fs.writeFileSync('client/src/components/Header.jsx', c);
console.log('Categories updated');
