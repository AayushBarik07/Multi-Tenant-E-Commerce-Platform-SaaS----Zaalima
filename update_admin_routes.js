const fs = require('fs');

// 2. AdminLayout.jsx
let layoutJsx = fs.readFileSync('client/src/components/admin/AdminLayout.jsx', 'utf8');
if (!layoutJsx.includes('to="/admin/payouts"')) {
  const oldStoresLink = `<Link
              to="/admin/stores"
              className={\`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors \${isActive('/admin/stores')}\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">Stores</span>
            </Link>`;
            
  const newLinks = `${oldStoresLink}
            
            <Link
              to="/admin/payouts"
              className={\`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors \${isActive('/admin/payouts')}\`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Payouts</span>
            </Link>`;
            
  layoutJsx = layoutJsx.replace(oldStoresLink, newLinks);
  fs.writeFileSync('client/src/components/admin/AdminLayout.jsx', layoutJsx);
  console.log('AdminLayout.jsx updated with Payouts sidebar link.');
}
