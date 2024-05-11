import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

interface CreateItemState {
  collection: {
    name?: string;
    icon?: string;
  };
  tokenId?: string;
}

const initialState: CreateItemState = {
  collection: {
    name: 'Mock-Collection',
  },
  tokenId: 'Mock-Id',
};

// Actual Slice
export const createItemSlice = createSlice({
  name: 'createItem',
  initialState,
  reducers: {
    setCollection: (state, action) => {
      state.collection = action.payload;
    },
    setItem: (state, action) => {
      state = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.createItem,
      };
    },
  },
});

export const {} = createItemSlice.actions;
export default createItemSlice.reducer;
