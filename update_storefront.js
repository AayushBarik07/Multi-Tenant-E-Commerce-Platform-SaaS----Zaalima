const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/Storefront.jsx', 'utf8');

// Inject import
if (!c.includes('import ProductCard')) {
  c = c.replace(
    "import { Link, useParams, useSearchParams } from 'react-router-dom';",
    "import { Link, useParams, useSearchParams } from 'react-router-dom';\nimport ProductCard from '../../components/ProductCard';"
  );
}

// Replace product mapping
const oldMapRegex = /\{filteredProducts\.map\(\(product\) => \([\s\S]*?<\/Link>\n\s*\)\)}/;

const newMap = `{filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}`;

c = c.replace(oldMapRegex, newMap);

// Replace button colors to match theme
c = c.replace(/bg-indigo-600/g, 'bg-[#FF5A24]');
c = c.replace(/text-indigo-600/g, 'text-[#FF5A24]');
c = c.replace(/hover:bg-indigo-700/g, 'hover:bg-orange-600');
c = c.replace(/focus:ring-indigo-500/g, 'focus:ring-orange-500');

fs.writeFileSync('client/src/pages/public/Storefront.jsx', c);
console.log('Storefront updated to use ProductCard and orange theme.');
