import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'store/store';
import { HYDRATE } from 'next-redux-wrapper';
import { IModalAction, IWhiteListConfig, IWhiteListState, MODAL_ACTION_TYPE } from './type';

const initialWhiteListInfoState: IWhiteListState = {
  whitelistId: undefined,
  projectWhiteList: undefined,
  adminAddress: undefined,
  userLevelList: undefined,
  tagInfoList: undefined,
  whitelistInfo: undefined,
  whitelistInfoList: undefined,
  refresh: Date.now(),
  chainId: undefined,
};

const initialUpdateCommonList = null;

const initWhiteListConfig: IWhiteListConfig = {};

export const hideModalAction: IModalAction = {
  type: MODAL_ACTION_TYPE.HIDE,
  modalState: {},
};

// Actual Slice
export const whiteListInfoSlice = createSlice({
  name: 'whiteListInfo',
  initialState: {
    whiteListInfo: initialWhiteListInfoState,
    modalAction: hideModalAction,
    updateCommonList: initialUpdateCommonList,
    whiteListConfig: initWhiteListConfig,
  },
  reducers: {
    setWhiteListInfo: (state, action) => {
      state.whiteListInfo = {
        ...state.whiteListInfo,
        ...action.payload,
      };
    },
    updateViewTheWhiteList: (state, action) => {
      state.modalAction = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.whiteListInfo,
      };
    },
  },
});

export const { setWhiteListInfo, updateViewTheWhiteList } = whiteListInfoSlice.actions;

export const getWhiteListInfo = (state: AppState): IWhiteListState => {
  return state.whiteListInfo.whiteListInfo;
};

export const getModalAction = (state: AppState): IModalAction => {
  return state.whiteListInfo.modalAction;
};

export default whiteListInfoSlice.reducer;
