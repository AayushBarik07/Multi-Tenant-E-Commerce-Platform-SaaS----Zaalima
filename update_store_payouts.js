const fs = require('fs');
let c = fs.readFileSync('client/src/redux/store.js', 'utf8');

if (!c.includes('payouts:')) {
  c = c.replace(
    "import wishlistReducer from './slices/wishlistSlice';",
    "import wishlistReducer from './slices/wishlistSlice';\nimport payoutsReducer from './slices/payoutsSlice';"
  );
  
  c = c.replace(
    "wishlist: wishlistReducer,",
    "wishlist: wishlistReducer,\n    payouts: payoutsReducer,"
  );
  
  fs.writeFileSync('client/src/redux/store.js', c);
  console.log('store.js updated with payoutsReducer');
}
