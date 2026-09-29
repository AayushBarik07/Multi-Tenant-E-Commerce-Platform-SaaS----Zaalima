const fs = require('fs');
let c = fs.readFileSync('client/src/pages/admin/AdminDashboard.jsx', 'utf8');

const oldHeader = `<h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Super Admin Command Center
      </h2>`;

const newHeader = `<div className="flex justify-between items-start mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Super Admin Command Center
        </h2>
        <button
          onClick={handleDownloadReport}
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Global Excel Report
        </button>
      </div>`;

if (c.includes('Super Admin Command Center')) {
  c = c.replace(oldHeader, newHeader);
  fs.writeFileSync('client/src/pages/admin/AdminDashboard.jsx', c);
  console.log('AdminDashboard updated with correct header and button');
} else {
  console.log('Could not find header');
}
