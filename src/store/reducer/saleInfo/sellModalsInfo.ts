import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  approveListingModal: {
    showRetryBtn: false,
  },
  invalidListingModal: {
    showRetryBtn: false,
  },
};

export const sellModalsInfosSlice = createSlice({
  name: 'sellModalsInfos',
  initialState,
  reducers: {
    setApproveListingModalRetry(state, action) {
      state.approveListingModal.showRetryBtn = action.payload;
    },
    setInvalidListingModalRetry(state, action) {
      state.invalidListingModal.showRetryBtn = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.sellModalsInfos,
      };
    },
  },
});

export const { setApproveListingModalRetry, setInvalidListingModalRetry } = sellModalsInfosSlice.actions;

export default sellModalsInfosSlice.reducer;
