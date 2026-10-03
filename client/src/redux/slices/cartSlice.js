import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const serialized = localStorage.getItem('ecomverse_cart');
    if (serialized === null) return [];
    return JSON.parse(serialized);
  } catch (e) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('ecomverse_cart', JSON.stringify(items));
  } catch (e) {
    console.error('Could not save cart', e);
  }
};

const initialState = {
  items: loadCartFromStorage(), // { product, variant, quantity }
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
      let product = action.payload.product;
      let variant = action.payload.variant;
      let quantity = action.payload.quantity || 1;

      if (!product && action.payload.id) {
        product = action.payload;
      }
      
      if (!product) return; 
      
      const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
      const existingItem = state.items.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
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
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.cartItemId !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(item => item.cartItemId === cartItemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
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
