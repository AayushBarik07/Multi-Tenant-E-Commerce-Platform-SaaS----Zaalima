const fs = require('fs');
let c = fs.readFileSync('client/src/pages/admin/AdminDashboard.jsx', 'utf8');

if (!c.includes('handleDownloadReport')) {
  const downloadFunc = `
  const handleDownloadReport = async () => {
    try {
      const token = await getToken();
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/reports/admin\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      if (!res.ok) throw new Error('Failed to download');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'EComVerse_Global_Report.xlsx';
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
    "useEffect(() => {",
    downloadFunc + "\n  useEffect(() => {"
  );

  const headerUI = `
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Command Center</h1>
            <p className="mt-2 text-sm text-slate-400">Global overview and performance metrics.</p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Global Excel Report
          </button>
        </div>
  `;

  c = c.replace(
    /<div>\s*<h1 className="text-3xl font-black text-white tracking-tight">Command Center<\/h1>\s*<p className="mt-2 text-sm text-slate-400">Global overview and performance metrics\.<\/p>\s*<\/div>/,
    headerUI
  );

  fs.writeFileSync('client/src/pages/admin/AdminDashboard.jsx', c);
  console.log('AdminDashboard updated with download button');
}
