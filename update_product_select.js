const fs = require('fs');

let c = fs.readFileSync('client/src/pages/vendor/ProductForm.jsx', 'utf8');

// 1. Fix default state
c = c.replace(
  "category: 'DRESSES'",
  "category: ''"
);

// 2. Fix fetch fallback
c = c.replace(
  "category: prodData.product.category || 'DRESSES'",
  "category: prodData.product.category || ''"
);

// 3. Add default disabled option to the dropdown
const oldSelect = `<select 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="DRESSES">Dresses</option>`;

const newSelect = `<select 
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="" disabled>-- Select Category --</option>
              <option value="DRESSES">Dresses</option>`;

if (c.includes(oldSelect)) {
    c = c.replace(oldSelect, newSelect);
    fs.writeFileSync('client/src/pages/vendor/ProductForm.jsx', c);
    console.log('ProductForm updated with default Select placeholder');
} else {
    console.error('Could not find the select block to replace.');
}
