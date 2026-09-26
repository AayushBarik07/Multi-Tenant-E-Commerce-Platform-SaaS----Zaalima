import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (token, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return data.wishlist;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to add to wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ token, product }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ productId: product.id })
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return product; // Return full product to update local state
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to remove from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ token, productId }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return productId; // Return productId to remove from local state
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  items: [], // Array of product objects
  itemIds: [], // Array of product IDs for quick checking O(1) in UI
  status: 'idle',
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.itemIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.itemIds = action.payload.map(item => item.id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.itemIds.includes(action.payload.id)) {
          state.itemIds.push(action.payload.id);
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.itemIds = state.itemIds.filter(id => id !== action.payload);
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
