const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/ProductForm.jsx', 'utf8');

c = c.replace(
  "brand_id: '',",
  "brand_id: '',\n      category: '',"
);

c = c.replace(
  "brand_id: prodData.product.brand_id || '',",
  "brand_id: prodData.product.brand_id || '',\n                category: prodData.product.category || '',"
);

c = c.replace(
  'const submitData = {',
  `const submitData = {
        category: formData.category,`
);

const categoryJSX = `
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input 
              type="text" 
              list="categories-list"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              placeholder="e.g. Clothing, Shoes, Electronics"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            />
            <datalist id="categories-list">
              <option value="Clothing" />
              <option value="Shoes" />
              <option value="Electronics" />
              <option value="Accessories" />
              <option value="Home & Kitchen" />
              <option value="Health & Beauty" />
            </datalist>
          </div>
`;

c = c.replace(
  '          <div>\n            <label className="block text-sm font-medium text-gray-700">Brand (Optional)</label>',
  categoryJSX + '\n          <div>\n            <label className="block text-sm font-medium text-gray-700">Brand (Optional)</label>'
);

fs.writeFileSync('client/src/pages/vendor/ProductForm.jsx', c);
console.log('ProductForm updated with Category');
