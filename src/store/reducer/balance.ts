import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'store/store';

export interface IBalanceState {
  main: number;
  side: number;
}

const initialState: IBalanceState = {
  main: 0,
  side: 0,
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setMainBalance(state, action) {
      state.main = action.payload;
    },
    setSideBalance(state, action) {
      state.side = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setMainBalance, setSideBalance } = balanceSlice.actions;
export const getBalance = (state: AppState) => state.balance;

export default balanceSlice.reducer;
