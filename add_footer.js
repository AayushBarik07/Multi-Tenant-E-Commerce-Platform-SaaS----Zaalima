const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!c.includes('import Footer')) {
  c = c.replace(
    "import CartDrawer from './components/public/CartDrawer';",
    "import CartDrawer from './components/public/CartDrawer';\nimport Footer from './components/Footer';"
  );
}

if (!c.includes('<Footer />')) {
  c = c.replace(
    "</main>",
    "</main>\n          <Footer />"
  );
}

fs.writeFileSync('client/src/App.jsx', c);
console.log('App.jsx updated with Footer');
