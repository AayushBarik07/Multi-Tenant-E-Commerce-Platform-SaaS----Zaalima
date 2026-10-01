const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/ProductForm.jsx', 'utf8');

// 1. Add category to state init
c = c.replace(
  "brand_id: ''",
  "brand_id: '',\n    category: 'DRESSES'"
);

// 2. Add category to fetch init
c = c.replace(
  "brand_id: prodData.product.brand_id || ''",
  "brand_id: prodData.product.brand_id || '',\n              category: prodData.product.category || 'DRESSES'"
);

// 3. Update grid and insert category dropdown
const oldBrandDiv = `<div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Brand Collection</label>`;

const newBrandAndCategory = `<div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Brand Collection</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.brand_id || ''}
              onChange={e => setFormData({...formData, brand_id: e.target.value})}
            >
              <option value="">-- No Brand (Uncategorized) --</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="DRESSES">Dresses</option>
              <option value="ACCESSORIES">Accessories</option>
              <option value="GADGETS">Gadgets</option>
              <option value="WATCHES">Watches</option>
              <option value="FOOTWEARS">Footwears</option>
              <option value="BEAUTY">Beauty</option>
              <option value="DECOR">Decor</option>
            </select>
          </div>`;

// Wait, the select logic for Brand Collection is already there, I just need to replace the col-span-2 with the whole new block.
// Let's do it safely.
const exactOldBrandHTML = `<div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Brand Collection</label>
            <select 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.brand_id || ''}
              onChange={e => setFormData({...formData, brand_id: e.target.value})}
            >
              <option value="">-- No Brand (Uncategorized) --</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>`;

if (c.includes(exactOldBrandHTML)) {
    c = c.replace(exactOldBrandHTML, newBrandAndCategory);
    fs.writeFileSync('client/src/pages/vendor/ProductForm.jsx', c);
    console.log('ProductForm.jsx updated with Category dropdown!');
} else {
    console.log('Failed to match exactly, attempting regex approach...');
    c = c.replace(/<div className="md:col-span-2">\s*<label className="block text-sm font-medium text-gray-700">Brand Collection<\/label>[\s\S]*?<\/select>\s*<\/div>/, newBrandAndCategory);
    fs.writeFileSync('client/src/pages/vendor/ProductForm.jsx', c);
    console.log('ProductForm.jsx updated via regex.');
}
