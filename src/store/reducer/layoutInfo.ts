import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { LayoutInfoStateType } from '../types/layoutInfo';
import { INftInfo } from 'types/nftTypes';

const initialState: LayoutInfoStateType = {
  filterList: null,
  filterSelect: null,
  isCollapsed: false,
  dropDownMenu: null,
  dropDownDateMenu: null,
  itemsSource: null,
  gridType: Number(typeof localStorage !== 'undefined' && localStorage.getItem('forest-layout')),
};

export const layoutInfoSlice = createSlice({
  name: 'layoutInfo',
  initialState,
  reducers: {
    setFilterList(state, action) {
      state.filterList = action.payload;
    },
    setFilterSelect(state, action) {
      state.filterSelect = action.payload;
    },
    setCollapsed(state, action) {
      state.isCollapsed = action.payload;
    },
    setGridType(state, action) {
      state.gridType = action.payload;
    },
    setItemsList(state, action) {
      state.itemsSource = action.payload;
    },
    addItemsList(state, action) {
      const source = action.payload;
      let items: INftInfo[] = [];
      if (state.itemsSource?.items?.length) {
        items = state.itemsSource.items;
      }
      if (source.items.length) {
        items = items.concat(source.items);
      }
      state.itemsSource = {
        items,
        totalCount: source.totalCount,
        end: source.end,
        page: source.page,
        tabType: source.tabType,
      };
    },
    setDropDownMenu(state, action) {
      state.dropDownMenu = action.payload;
    },
    initialLayoutInfo(state) {
      Object.assign(state, initialState);
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

export const {
  setFilterList,
  setCollapsed,
  setGridType,
  setItemsList,
  addItemsList,
  initialLayoutInfo,
  setDropDownMenu,
  setFilterSelect,
} = layoutInfoSlice.actions;
export default layoutInfoSlice.reducer;
