const fs = require('fs');
let c = fs.readFileSync('client/src/redux/slices/wishlistSlice.js', 'utf8');

// Update addToWishlist signature to accept full product
c = c.replace(
  "async ({ token, productId }, { rejectWithValue })",
  "async ({ token, product }, { rejectWithValue })"
);

c = c.replace(
  "body: JSON.stringify({ productId })",
  "body: JSON.stringify({ productId: product.id })"
);

c = c.replace(
  "return productId; // Return productId to update local state",
  "return product; // Return full product to update local state"
);

// Update reducer to push full product
const oldReducer = /\.addCase\(addToWishlist\.fulfilled, \(state, action\) => \{\s*if \(\!state\.itemIds\.includes\(action\.payload\)\) \{\s*state\.itemIds\.push\(action\.payload\);\s*\}\s*\}\)/;

const newReducer = `.addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.itemIds.includes(action.payload.id)) {
          state.itemIds.push(action.payload.id);
          state.items.push(action.payload);
        }
      })`;

c = c.replace(oldReducer, newReducer);

fs.writeFileSync('client/src/redux/slices/wishlistSlice.js', c);
console.log('wishlistSlice updated.');
