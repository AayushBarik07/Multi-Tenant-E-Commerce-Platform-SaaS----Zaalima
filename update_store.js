const fs = require('fs');
let c = fs.readFileSync('client/src/redux/store.js', 'utf8');

if (!c.includes('wishlist:')) {
  c = c.replace(
    "import authReducer from './slices/authSlice';",
    "import authReducer from './slices/authSlice';\nimport wishlistReducer from './slices/wishlistSlice';"
  );
  
  c = c.replace(
    "auth: authReducer,",
    "auth: authReducer,\n    wishlist: wishlistReducer,"
  );
  
  fs.writeFileSync('client/src/redux/store.js', c);
  console.log('store.js updated');
}
