'use client';

import { store } from '../store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from 'components/PageLoading';

const storeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<Loading />}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default storeProvider;
