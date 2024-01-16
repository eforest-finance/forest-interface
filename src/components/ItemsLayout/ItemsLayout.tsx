import { Layout } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './ItemsLayout.module.css';
import TabsHeader, { TabNavType } from '../TabsHeader/TabsHeader';
import CollectedPage from './CollectedPage';
import { useHash, useLocation } from 'react-use';
import { dispatch } from 'store/store';
import { setItemsList, initialLayoutInfo, setFilterSelect } from 'store/reducer/layoutInfo';

export interface ItemsLayoutProps {
  tabNav: TabNavType[];
  className?: string;
  showAdd?: boolean;
}

export default function ItemsLayout({ tabNav, showAdd, className }: ItemsLayoutProps) {
  const [, setHash] = useHash();
  const hash = window.location.hash;
  const [activeKey, setActiveKey] = useState<string>(hash?.slice(1) ?? '');
  useEffect(() => {
    setActiveKey(hash?.slice(1) ?? '');
  }, [hash]);
  const tabsChange = useCallback(
    (v: string) => {
      dispatch(setItemsList(null));
      setActiveKey(v);
      setHash(v);
      dispatch(setFilterSelect(null));
    },
    [setHash],
  );

  useEffect(() => {
    dispatch(initialLayoutInfo());
  }, []);

  const tabNavMap: { [x: string]: TabNavType } = useMemo(() => {
    let map = {};
    tabNav.forEach((item) => {
      map = {
        ...map,
        [item.key]: item,
      };
    });

    return map;
  }, [tabNav]);
  return (
    <>
      <Layout className={`${styles['protocol-items-layout']} ${styles['layout']} ${className}`}>
        <Layout.Header>
          <TabsHeader activeKey={activeKey} tabNav={tabNav} onChange={tabsChange} />
        </Layout.Header>
        <Layout className={styles['protocol-items-content']}>
          {tabNavMap[activeKey ?? tabNav[0].key]?.element ?? <CollectedPage showAdd={showAdd} />}
        </Layout>
      </Layout>
    </>
  );
}
