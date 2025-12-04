import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';
import { INftTypes } from 'api/types';

export const initialToken: Token | null = null;
export const initialChains: Chain[] = ['AELF', 'tDVV', 'tDVW'];

export const initialInfoState: {
  supportChains: Chain[];
  nftTypes: INftTypes[];
} = {
  supportChains: initialChains,
  nftTypes: [],
};
// Actual Slice
export const nftInfoSlice = createSlice({
  name: 'nftInfo',
  initialState: initialInfoState,
  reducers: {
    setChainsInfo(state, action) {
      state.supportChains = action.payload;
    },
    setNftTypes(state, action) {
      state.nftTypes = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.chains,
      };
    },
  },
});

export const { setChainsInfo, setNftTypes } = nftInfoSlice.actions;

export const getChainsInfo = (state: AppState): Chain[] => state.nftInfo.supportChains;
export const getNftTypes = (state: AppState): INftTypes[] => state.nftInfo.nftTypes;

export default nftInfoSlice.reducer;
