import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPayouts = createAsyncThunk('payouts/fetchPayouts', async (token, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return data.payouts;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const requestPayout = createAsyncThunk('payouts/requestPayout', async ({ token, amount }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/request`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return data.payout;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updatePayoutStatus = createAsyncThunk('payouts/updatePayoutStatus', async ({ token, payoutId, status }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/${payoutId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!data.success) return rejectWithValue(data.error);
    return data.payout;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const payoutsSlice = createSlice({
  name: 'payouts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    requestStatus: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayouts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(requestPayout.pending, (state) => { state.requestStatus = 'loading'; })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.requestStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updatePayoutStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default payoutsSlice.reducer;
