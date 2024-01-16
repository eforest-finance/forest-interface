import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';

export interface PreviewInfoType {
  token?: {
    symbol: string;
    price: string;
    decimals: number;
  };
  price?: string;
}

export type SaleStateType = {
  previewInfo: PreviewInfoType;
};

const initialState: SaleStateType = {
  previewInfo: {},
};

// Actual Slice
export const saleInfoSlice = createSlice({
  name: 'saleInfo',
  initialState,
  reducers: {
    setPreviewInfo: (state, action) => {
      state.previewInfo = action.payload;
    },
    destroyPreviewInfo: (state) => {
      state.previewInfo = {};
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.saleInfo,
      };
    },
  },
});

export const { setPreviewInfo } = saleInfoSlice.actions;

export const getPreviewInfo = (state: AppState) => state.saleInfo.previewInfo;

export default saleInfoSlice.reducer;
