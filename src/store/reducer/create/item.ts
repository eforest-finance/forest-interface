import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { FileUploadType } from 'pagesComponents/CreateItemNew/components/Upload/UploadSingle';

export interface ISingleFile {
  fileType?: FileUploadType;
  url?: string;
  hash?: string;
}

interface CreateItemState {
  collection: {
    name?: string;
    icon?: string;
  };
  tokenId?: string;
  singleFile?: ISingleFile;
  batchFiles?: ISingleFile[];
}

const initialState: CreateItemState = {
  collection: {
    name: 'Mock-Collection',
  },
  tokenId: 'Mock-Id',
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
    setSingleFile: (state, action) => {
      state.singleFile = action.payload;
    },
    setBatchFiles: (state, action) => {
      state.batchFiles = action.payload;
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

export const { setCollection, setItem, setSingleFile, setBatchFiles } = createItemSlice.actions;
export default createItemSlice.reducer;
