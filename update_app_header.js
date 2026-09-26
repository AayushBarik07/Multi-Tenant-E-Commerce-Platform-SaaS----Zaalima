const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

// Replace the old inline header chunk with <Header />
const headerRegex = /\{\/\* Top Announcement Bar \*\/\}[\s\S]*?<\/header>/;

c = c.replace(headerRegex, "<Header />");

// Make sure to import Header
if (!c.includes("import Header from './components/Header';")) {
  c = c.replace(
    "import Footer from './components/Footer';",
    "import Footer from './components/Footer';\nimport Header from './components/Header';"
  );
}

fs.writeFileSync('client/src/App.jsx', c);
console.log('App.jsx updated to use new Header component.');
