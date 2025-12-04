import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface errorModalInfoState {
  visible: boolean;
}

const initialState: errorModalInfoState = {
  visible: false,
};

export const errorModalInfoSlice = createSlice({
  name: 'errorModalInfo',
  initialState,
  reducers: {
    closeModal(state) {
      state.visible = false;
    },
    openModal(state) {
      state.visible = true;
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

export const { closeModal, openModal } = errorModalInfoSlice.actions;
export default errorModalInfoSlice.reducer;
