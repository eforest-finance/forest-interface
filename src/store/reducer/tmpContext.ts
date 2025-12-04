import { createSlice } from '@reduxjs/toolkit';
// import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';

export const initialtmpContextInfo: any = {};

// Actual Slice
export const tmpContextSlice = createSlice({
  name: 'tmpContext',
  initialState: {
    info: initialtmpContextInfo,
  },
  reducers: {
    setTmpContextInfo(state, action) {
      state.info = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.tmpContext,
      };
    },
  },
});

export const { setTmpContextInfo } = tmpContextSlice.actions;

export const getTmpContextInfo = (state: any) => state.tmpContext.info;

export default tmpContextSlice.reducer;
