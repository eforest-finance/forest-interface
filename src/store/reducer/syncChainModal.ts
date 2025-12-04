import { createSlice } from '@reduxjs/toolkit';
// import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'store/store';

const initialState = {
  pauseState: undefined,
  crossChainSyncStatusComplete: undefined,
};

// Actual Slice
export const syncChainModalSlice = createSlice({
  name: 'syncChainModal',
  initialState,
  reducers: {
    setPauseState(state, action) {
      state.pauseState = action.payload;
    },
    setCrossChainSyncCompleteStatus(state, action) {
      state.crossChainSyncStatusComplete = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setPauseState, setCrossChainSyncCompleteStatus } = syncChainModalSlice.actions;

export const getPauseState = (state: AppState) => state.syncChainModal.pauseState;
export const getCrossChainSyncStatusComplete = (state: AppState) => state.syncChainModal.crossChainSyncStatusComplete;

export default syncChainModalSlice.reducer;
