const fs = require('fs');

let c = fs.readFileSync('client/src/pages/public/Home.jsx', 'utf8');

if (!c.includes('useSearchParams')) {
    c = c.replace(
        "import { Link } from 'react-router-dom';",
        "import { Link, useSearchParams } from 'react-router-dom';"
    );
}

// Ensure useSearchParams is inside the component
if (!c.includes('const [searchParams] = useSearchParams();')) {
    c = c.replace(
        "const [loading, setLoading] = useState(true);",
        "const [loading, setLoading] = useState(true);\n  const [searchParams] = useSearchParams();\n  const categoryQuery = searchParams.get('category');\n  const searchQuery = searchParams.get('search');"
    );
}

// Modify the filtering logic
const oldFilter = "const allProducts = products;";
const newFilter = `let allProducts = products;
  
  if (categoryQuery) {
    allProducts = allProducts.filter(p => {
      const cat = p.category ? p.category.toLowerCase() : '';
      const name = p.name ? p.name.toLowerCase() : '';
      const target = categoryQuery.toLowerCase();
      return cat === target || cat.includes(target) || name.includes(target);
    });
  }
  
  if (searchQuery) {
    allProducts = allProducts.filter(p => {
      const name = p.name ? p.name.toLowerCase() : '';
      const desc = p.description ? p.description.toLowerCase() : '';
      const target = searchQuery.toLowerCase();
      return name.includes(target) || desc.includes(target);
    });
  }`;

if (c.includes(oldFilter)) {
    c = c.replace(oldFilter, newFilter);
}

// Display search/category context
const oldTitle = '<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Products</h2>';
const newTitle = `{categoryQuery || searchQuery ? (
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {searchQuery ? \`Search Results for "\${searchQuery}"\` : \`\${categoryQuery} Collection\`}
              </h2>
            ) : (
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Products</h2>
            )}`;
if (c.includes(oldTitle)) {
    c = c.replace(oldTitle, newTitle);
}

fs.writeFileSync('client/src/pages/public/Home.jsx', c);
console.log('Home.jsx updated for filtering');
