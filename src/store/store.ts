import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers } from 'redux';

import InfoReducer, { infoSlice } from './reducer/info';
import AelfInfoReducer, { aelfInfoSlice } from './reducer/aelfInfo';
import NFTInfoReducer, { nftInfoSlice } from './reducer/nftInfo';
import NightElfInfoReducer, { nightElfInfoSlice } from './reducer/nightElfInfo';
import TmpContextReducer, { tmpContextSlice } from './reducer/tmpContext';
import UserInfoReducer, { userInfoSlice } from './reducer/userInfo';
import ErrorModalReducer, { errorModalInfoSlice } from './reducer/errorModalInfo';
import LayoutInfoReducer, { layoutInfoSlice } from './reducer/layoutInfo';
import DetailInfoReducer, { detailInfoSlice } from 'store/reducer/detail/detailInfo';
import WhiteListInfoReducer, { whiteListInfoSlice } from 'store/reducer/saleInfo/whiteListInfo';
import SaleInfoReducer, { saleInfoSlice } from 'store/reducer/saleInfo/saleInfo';
import SyncChainModalReducer, { syncChainModalSlice } from 'store/reducer/syncChainModal';
import sellModalsInfosSliceReducer, { sellModalsInfosSlice } from 'store/reducer/saleInfo/sellModalsInfo';
import dropDetailInfoReducer, { dropDetailInfoSlice } from 'store/reducer/dropDetail/dropDetailInfo';
import CreateItemReducer, { createItemSlice } from './reducer/create/item';
import CreateItemAIReducer, { createItemAISlice } from './reducer/create/itemsByAI';
import BalanceReducer, { balanceSlice } from './reducer/balance';

import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';

const rootReducer = combineReducers({
  [infoSlice.name]: InfoReducer,
  [aelfInfoSlice.name]: AelfInfoReducer,
  [nftInfoSlice.name]: NFTInfoReducer,
  [nightElfInfoSlice.name]: NightElfInfoReducer,
  [tmpContextSlice.name]: TmpContextReducer,
  [userInfoSlice.name]: UserInfoReducer,
  [errorModalInfoSlice.name]: ErrorModalReducer,
  [layoutInfoSlice.name]: LayoutInfoReducer,
  [detailInfoSlice.name]: DetailInfoReducer,
  [saleInfoSlice.name]: SaleInfoReducer,
  [whiteListInfoSlice.name]: WhiteListInfoReducer,
  [syncChainModalSlice.name]: SyncChainModalReducer,
  [sellModalsInfosSlice.name]: sellModalsInfosSliceReducer,
  [dropDetailInfoSlice.name]: dropDetailInfoReducer,
  [createItemSlice.name]: CreateItemReducer,
  [createItemAISlice.name]: CreateItemAIReducer,
  [balanceSlice.name]: BalanceReducer,
});

const makeStore = () => {
  const persistConfig = {
    key: 'nextjs',
    whitelist: ['auth'], // make sure it does not clash with server keys
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    // devTools: process.env.NODE_ENV !== 'production',
  });

  return {
    ...store,
    __persistor: persistStore(store),
  };
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const store: AppStore = makeStore();
export const dispatch: AppDispatch = store.dispatch;
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
