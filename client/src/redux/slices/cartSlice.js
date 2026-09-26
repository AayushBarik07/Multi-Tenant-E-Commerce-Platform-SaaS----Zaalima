import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { product, variant, quantity }
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    addToCart: (state, action) => {
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
      const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
      
      const existingItem = state.items.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        // If variant exists, check variant stock, else check product stock
        const maxStock = variant ? variant.stock : product.stock;
        if (existingItem.quantity + quantity <= maxStock) {
          existingItem.quantity += quantity;
        }
      } else {
        state.items.push({
          cartItemId,
          product,
          variant,
          quantity
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.cartItemId !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { 
  toggleCart, 
  openCart, 
  closeCart, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
