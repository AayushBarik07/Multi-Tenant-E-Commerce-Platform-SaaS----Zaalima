const fs = require('fs');

let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

const oldProfile = `{/* Profile */}
            <div className="flex flex-col items-center justify-center cursor-pointer group">
              <SignedOut>
                <SignInButton mode="modal">
                  <div className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F]">
                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-[11px] font-bold">Profile</span>
                  </div>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard" className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F]">
                  <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span className="text-[11px] font-bold">Profile</span>
                </Link>
              </SignedIn>
            </div>`;

const newProfile = `{/* Auth Logic */}
            <SignedOut>
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="text-[13px] font-bold text-[#282C3F] hover:text-[#FF5A24] transition-colors">Login</button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/">
                  <button className="text-[12px] font-bold bg-[#FF3F6C] text-white px-4 py-2 rounded-md hover:bg-rose-500 transition-colors shadow-sm">Sign Up</button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              {/* Profile */}
              <div className="flex flex-col items-center justify-center cursor-pointer group">
                <Link to="/dashboard" className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F]">
                  <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span className="text-[11px] font-bold">Profile</span>
                </Link>
              </div>
            </SignedIn>`;

if (c.includes('{/* Profile */}')) {
    c = c.replace(oldProfile, newProfile);
    fs.writeFileSync('client/src/components/Header.jsx', c);
    console.log('Header.jsx updated with separate Auth UI');
} else {
    console.log('Could not find Profile block');
}
