const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/Home.jsx', 'utf8');

const scrollLogic = `  // Scroll to products when filter changes
  useEffect(() => {
    if (categoryQuery || searchQuery) {
      setTimeout(() => {
        document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [categoryQuery, searchQuery]);

  let allProducts`;

if (!c.includes('scrollIntoView')) {
    c = c.replace('let allProducts', scrollLogic);
    fs.writeFileSync('client/src/pages/public/Home.jsx', c);
    console.log('Scroll logic added to Home.jsx');
} else {
    console.log('Scroll logic already present');
}
