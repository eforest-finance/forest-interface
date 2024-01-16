import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';
import { ItemState } from '../../types/reducer';

export const initializationNftNumber = {
  nftBalance: 0,
  tokenBalance: 0,
  nftQuantity: 0,
  nftTotalSupply: 0,
  loading: false,
};

const initialState: ItemState = {
  nftInfo: null,
  nftNumber: initializationNftNumber,
  listings: null,
  offers: null,
  updateDetailLoading: false,
};

// Actual Slice
export const detailInfoSlice = createSlice({
  name: 'detailInfo',
  initialState,
  reducers: {
    setNftInfo: (state, action) => {
      state.nftInfo = action.payload;
    },
    setNftNumber: (state, action) => {
      state.nftNumber = {
        ...state.nftNumber,
        ...action.payload,
      };
    },
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setOffers: (state, action) => {
      state.offers = action.payload;
    },
    setUpdateDetailLoading: (state, action) => {
      state.updateDetailLoading = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.detailInfo,
      };
    },
  },
});

export const { setNftInfo, setListings, setOffers, setNftNumber, setUpdateDetailLoading } = detailInfoSlice.actions;

export const getDetailInfo = (state: AppState): ItemState => state.detailInfo;

export default detailInfoSlice.reducer;
