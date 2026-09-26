const fs = require('fs');
let c = fs.readFileSync('client/src/redux/slices/cartSlice.js', 'utf8');

const oldAddToCart = `    addToCart: (state, action) => {
      const { product, variant, quantity = 1 } = action.payload;
      
      // Generate a unique ID for the cart item based on product and variant
      const cartItemId = variant ? \`\${product.id}-\${variant.id}\` : product.id;`;

const newAddToCart = `    addToCart: (state, action) => {
      // Defensive parsing to support both old cached payloads and new payloads
      let product = action.payload.product;
      let variant = action.payload.variant;
      let quantity = action.payload.quantity || 1;

      // If product is undefined, it means an old payload format was sent ({ id, name, price, ... })
      if (!product && action.payload.id) {
        product = action.payload;
      }
      
      if (!product) return; // Prevent crash if somehow entirely empty
      
      // Generate a unique ID for the cart item based on product and variant
      const cartItemId = variant ? \`\${product.id}-\${variant.id}\` : product.id;`;

c = c.replace(oldAddToCart, newAddToCart);

fs.writeFileSync('client/src/redux/slices/cartSlice.js', c);
console.log('cartSlice updated with defensive payload check.');
