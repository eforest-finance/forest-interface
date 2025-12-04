import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface INFTForm {
  collectionId?: string;
  collectionName?: string;
  collectionIcon?: string;
  tokenName?: string;
  quantity?: string | number;
  tokenId?: string | number;
  externalLink?: string;
  description?: string;
  metaData?: Array<{
    key: string;
    value: any;
  }>;
  imageUrl: string;
  hash: string;
}

interface CreateItemAIState {
  nftInfoFormList: Array<INFTForm>;
  currentCollection?: {
    id: string;
    tokenName: string;
    logoImage?: string;
  };
  currentSelIndex: number;
}

const initialState: CreateItemAIState = {
  nftInfoFormList: [],
  currentSelIndex: 0,
};

export const createItemAISlice = createSlice({
  name: 'createItemAI',
  initialState,
  reducers: {
    setNftInfoFormList: (state, action) => {
      state.nftInfoFormList = action.payload;
    },

    editCurrentSelNftInfoForm: (state, action) => {
      const index = state.currentSelIndex;
      const data = state.nftInfoFormList[index];
      if (!data) return;
      state.nftInfoFormList.splice(index, 1, Object.assign({}, data, action.payload));
    },

    setCollection: (state, action) => {
      state.currentCollection = action.payload;
      state.nftInfoFormList = state.nftInfoFormList.map((item) => ({
        ...item,
        collectionId: action.payload.id,
        collectionName: action.payload.tokenName,
        collectionIcon: action.payload.logoImage,
      }));
    },
    setCurrentSelIndex: (state, action) => {
      state.currentSelIndex = action.payload;
    },

    clearNftInfoFormList: (state) => {
      state.nftInfoFormList = [];
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.createItemAI,
      };
    },
  },
});

export const {
  setNftInfoFormList,
  setCollection,
  editCurrentSelNftInfoForm,
  setCurrentSelIndex,
  clearNftInfoFormList,
} = createItemAISlice.actions;
export default createItemAISlice.reducer;
