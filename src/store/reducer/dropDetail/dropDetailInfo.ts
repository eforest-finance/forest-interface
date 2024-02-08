import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';
import { IDropDetailResponse, IDropQuotaResponse } from 'api/types';

const initialState: {
  dropDetailInfo: IDropDetailResponse | null;
  dropQuota: IDropQuotaResponse | null;
} = {
  dropDetailInfo: null,
  dropQuota: null,
};

// Actual Slice
export const dropDetailInfoSlice = createSlice({
  name: 'dropDetailInfo',
  initialState,
  reducers: {
    setDropDetailInfo: (state, action) => {
      state.dropDetailInfo = action.payload;
    },
    setDropQuota: (state, action) => {
      state.dropQuota = {
        ...state.dropQuota,
        ...action.payload,
      };
    },
    clearDropDetailInfo: (state) => {
      state.dropDetailInfo = null;
      state.dropQuota = null;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.dropDetailInfo,
      };
    },
  },
});

export const { setDropDetailInfo, setDropQuota, clearDropDetailInfo } = dropDetailInfoSlice.actions;

export const getDropDetailInfo = (state: AppState): IDropDetailResponse | null => state.dropDetailInfo.dropDetailInfo;
export const getDropQuota = (state: AppState): IDropQuotaResponse | null => state.dropDetailInfo.dropQuota;

export default dropDetailInfoSlice.reducer;
