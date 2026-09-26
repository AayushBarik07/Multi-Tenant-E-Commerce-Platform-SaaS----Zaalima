const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

// 1. Add useMemo to imports
if (!c.includes('useMemo')) {
  c = c.replace(
    "import { useDispatch, useSelector } from 'react-redux';",
    "import { useDispatch, useSelector } from 'react-redux';\nimport { useMemo } from 'react';"
  );
}

// 2. Fix the addToWishlist dispatch
c = c.replace(
  "dispatch(addToWishlist({ token, productId: product.id }));",
  "dispatch(addToWishlist({ token, product }));"
);

// 3. Fix the random values using useMemo
const oldVars = `  // Check if we need to show badges (mock logic for visual)
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const discount = Math.floor(Math.random() * 30) + 10; // Mock discount badge for visual parity`;

const newVars = `  // Check if we need to show badges (mock logic for visual)
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // Memoize random values so they don't change on re-render (like when heart icon toggles state)
  const discount = useMemo(() => Math.floor(Math.random() * 30) + 10, [product.id]);
  const reviewCount = useMemo(() => Math.floor(Math.random() * 200) + 12, [product.id]);`;

c = c.replace(oldVars, newVars);

// Replace inline Math.random for reviewCount with the memoized variable
c = c.replace(
  `({Math.floor(Math.random() * 200) + 12})`,
  `({reviewCount})`
);

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard updated with useMemo and wishlist fix.');
