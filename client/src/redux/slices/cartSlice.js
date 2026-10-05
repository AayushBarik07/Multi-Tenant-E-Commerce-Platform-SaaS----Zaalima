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

const loadCouponFromStorage = () => {
  try {
    const serialized = localStorage.getItem('ecomverse_coupon');
    if (serialized === null) return null;
    return JSON.parse(serialized);
  } catch (e) {
    return null;
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('ecomverse_cart', JSON.stringify(items));
  } catch (e) {
    console.error('Could not save cart', e);
  }
};

const saveCouponToStorage = (coupon) => {
  try {
    if (coupon) {
      localStorage.setItem('ecomverse_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('ecomverse_coupon');
    }
  } catch (e) {
    console.error('Could not save coupon', e);
  }
};

const initialState = {
  items: loadCartFromStorage(), // { product, variant, quantity }
  coupon: loadCouponFromStorage(), // { code, discountPercent, discountFlat }
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
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      saveCouponToStorage(state.coupon);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      saveCouponToStorage(null);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      saveCartToStorage(state.items);
      saveCouponToStorage(null);
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
  applyCoupon,
  removeCoupon,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
