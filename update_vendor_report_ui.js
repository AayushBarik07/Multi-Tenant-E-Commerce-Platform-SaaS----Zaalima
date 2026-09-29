const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/VendorWallet.jsx', 'utf8');

if (!c.includes('handleDownloadReport')) {
  const downloadFunc = `
  const handleDownloadReport = async () => {
    try {
      const token = await getToken();
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/reports/vendor\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      if (!res.ok) throw new Error('Failed to download');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'My_Store_Analytics.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download report.');
    }
  };
  `;

  c = c.replace(
    "const handleRequestPayout = async (e) => {",
    downloadFunc + "\n  const handleRequestPayout = async (e) => {"
  );

  const downloadBtn = `
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Earnings</h1>
        <button
          onClick={handleDownloadReport}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Excel Report
        </button>
      </div>
  `;

  c = c.replace(
    '<h1 className="text-2xl font-bold text-gray-900 mb-8">Wallet & Earnings</h1>',
    downloadBtn
  );

  fs.writeFileSync('client/src/pages/vendor/VendorWallet.jsx', c);
  console.log('VendorWallet updated with download button');
}
