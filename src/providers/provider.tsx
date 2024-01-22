'use client';

import StoreProvider from 'providers/storeProvider';
import { message } from 'antd';
import { AELFDProvider } from 'aelf-design';

import WebLoginProvider from './webLoginProvider';
import { useEffect, useState } from 'react';
import { store } from 'store/store';
import Loading from 'components/PageLoading';

import { fetchConfigItems } from 'api/fetch';
import { setAelfInfo } from 'store/reducer/aelfInfo';
import { themeColor } from 'styles/themeColor';

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const storeConfig = async () => {
    const { data } = await fetchConfigItems();
    store.dispatch(setAelfInfo(data));

    setLoading(false);
  };
  useEffect(() => {
    storeConfig();
    message.config({
      maxCount: 1,
    });
  }, []);
  return (
    <>
      <StoreProvider>
        <AELFDProvider
          prefixCls="ant"
          theme={{
            token: {
              colorPrimary: themeColor.brandNormal,
              colorPrimaryHover: themeColor.brandHover,
              colorPrimaryActive: themeColor.brandClick,
            },
          }}>
          {loading ? <Loading></Loading> : <WebLoginProvider>{children}</WebLoginProvider>}
        </AELFDProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
