const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/VendorWallet.jsx', 'utf8');

const oldMockCode = `  // Mock wallet numbers for now since we don't have a real earnings table yet.
  // We can calculate pending/completed from the payouts array!
  const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalCompleted = payouts.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalEarned = 5000; // Mock total earnings
  const availableBalance = totalEarned - totalPending - totalCompleted;

  if (status === 'loading') return <div className="text-gray-500 p-8">Loading wallet...</div>;`;

const newCode = `  const [wallet, setWallet] = useState({
    totalSales: 0,
    commissionRate: 0.1,
    lifetimeEarnings: 0,
    totalPending: 0,
    totalCompleted: 0,
    availableBalance: 0
  });

  useEffect(() => {
    const fetchWallet = async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const res = await fetch(\`\${import.meta.env.VITE_API_URL}/payouts/wallet\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        const data = await res.json();
        if (data.success) {
          setWallet(data.wallet);
        }
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
      }
    };
    if (isLoaded && isSignedIn && status !== 'loading') {
      fetchWallet();
    }
  }, [isLoaded, isSignedIn, status, getToken, payouts]); // re-fetch when payouts change

  const totalPending = wallet.totalPending;
  const totalCompleted = wallet.totalCompleted;
  const availableBalance = wallet.availableBalance;

  if (status === 'loading') return <div className="text-gray-500 p-8">Loading wallet...</div>;`;

c = c.replace(oldMockCode, newCode);

fs.writeFileSync('client/src/pages/vendor/VendorWallet.jsx', c);
console.log('VendorWallet updated to use real backend data');
