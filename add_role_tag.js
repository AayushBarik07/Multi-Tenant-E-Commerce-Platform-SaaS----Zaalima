const fs = require('fs');
let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

const oldSignedIn = `<SignedIn>
              <Link to="/dashboard" className="cursor-pointer hidden md:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-[#FF5A24]">
                Dashboard
              </Link>
              <div className="border-2 border-transparent hover:border-[#FF5A24] rounded-full transition-all">
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </SignedIn>`;

const newSignedIn = `<SignedIn>
              {dbUser && (
                <span className={\`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border \${dbUser.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' : dbUser.role === 'VENDOR' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}\`}>
                  {dbUser.role === 'SUPER_ADMIN' ? 'ADMIN' : dbUser.role}
                </span>
              )}
              <Link to="/dashboard" className="cursor-pointer hidden md:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-[#FF5A24]">
                Dashboard
              </Link>
              <div className="border-2 border-transparent hover:border-[#FF5A24] rounded-full transition-all">
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </SignedIn>`;

if (c.includes(oldSignedIn)) {
  c = c.replace(oldSignedIn, newSignedIn);
  fs.writeFileSync('client/src/components/Header.jsx', c);
  console.log('Role tag added back to Header');
} else {
  console.log('Could not find the Exact SignedIn block. Please check string formatting.');
}
