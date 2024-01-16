'use client';

import StoreProvider from 'providers/storeProvider';
import { ConfigProvider, message } from 'antd';

import enUS from 'antd/lib/locale/en_US';

import { prefixCls } from 'constants/theme';
import WebLoginProvider from './webLoginProvider';
import { useEffect, useState } from 'react';
import { store } from 'store/store';
import Loading from 'components/PageLoading';

import { fetchConfigItems } from 'api/fetch';
import { setAelfInfo } from 'store/reducer/aelfInfo';

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
        <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
          {loading ? <Loading></Loading> : <WebLoginProvider>{children}</WebLoginProvider>}
        </ConfigProvider>
      </StoreProvider>
    </>
  );
}

export default Provider;
