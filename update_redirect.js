const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/Checkout.jsx', 'utf8');

const target = `      // Payment successful!
      setMessage('Payment successful! Your order has been placed.');
      dispatch(clearCart());
      setTimeout(() => {
        navigate('/'); // Redirect to home or an order success page
      }, 3000);`;

const replacement = `      // Payment successful!
      dispatch(clearCart());
      navigate(\`/success/\${paymentIntent.id}\`);`;

c = c.replace(target, replacement);

fs.writeFileSync('client/src/pages/public/Checkout.jsx', c);
console.log('Checkout.jsx redirect updated');
