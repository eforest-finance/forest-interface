import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { FileUploadType } from 'pagesComponents/CreateItemV2/components/Upload/UploadSingle';

export interface ISingleFile {
  fileType?: FileUploadType;
  url?: string;
  hash?: string;
  error?: string;
}

interface CreateItemState {
  collection?: {
    name?: string;
    icon?: string;
    tokenName?: string;
    logoImage?: string;
  };
  tokenId?: string;
  nftName?: string;
  singleFile?: ISingleFile;
  batchFiles?: ISingleFile[];
}

const initialState: CreateItemState = {
  batchFiles: [],
};

// Actual Slice
export const createItemSlice = createSlice({
  name: 'createItem',
  initialState,
  reducers: {
    setCollection: (state, action) => {
      state.collection = action.payload;
    },
    setItem: (state, action) => {
      state = action.payload;
    },
    setTokenId: (state, action) => {
      state.tokenId = action.payload;
    },
    setNFTName: (state, action) => {
      state.nftName = action.payload;
    },
    setSingleFile: (state, action) => {
      state.singleFile = action.payload;
    },
    setBatchFiles: (state, action) => {
      state.batchFiles = action.payload;
    },

    resetValue: (state) => {
      state.collection = undefined;
      state.tokenId = undefined;
      state.nftName = undefined;
      state.singleFile = undefined;
      state.batchFiles = [];
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.createItem,
      };
    },
  },
});

export const { setCollection, setTokenId, setNFTName, setItem, setSingleFile, setBatchFiles, resetValue } =
  createItemSlice.actions;
export default createItemSlice.reducer;
