import { Layout } from 'antd';
import ItemsSideMenu from '../ItemsSideMenu/ItemsSideMenu';
import CollapsedIcon from 'assets/images/Collapsed.svg';
import { useMemo } from 'react';
import styles from './ItemsSide.module.css';
import { useSelector, dispatch } from 'store/store';
import { setCollapsed, setFilterSelect } from 'store/reducer/layoutInfo';
import useResponsive from 'hooks/useResponsive';

export default function ItemsSide() {
  const {
    info: { isSmallScreen },
    layoutInfo: { isCollapsed },
  } = useSelector((store) => store);
  const Trigger = useMemo(() => {
    return (
      <div
        className={`${styles['collapsed-wrapper']} flex justify-between items-center`}
        onClick={() => {
          dispatch(setCollapsed(!isCollapsed));
        }}>
        {!isCollapsed && <span>{'Filter'}</span>}
        <CollapsedIcon />
      </div>
    );
  }, [isCollapsed]);

  const MTrigger = useMemo(() => {
    return (
      <div className={styles['mobile-side-action-wrapper']}>
        <span
          className="pr-[16px] whitespace-nowrap"
          onClick={() => {
            dispatch(setCollapsed(!isCollapsed));
            dispatch(setFilterSelect(null));
          }}>
          Clear All
        </span>
        <span
          onClick={() => {
            dispatch(setCollapsed(!isCollapsed));
          }}>
          Done
        </span>
      </div>
    );
  }, [isCollapsed]);

  const { isLG } = useResponsive();

  return (
    <Layout.Sider
      className={`${styles['items-sider-wrapper']} ${isSmallScreen ? styles.mobile : ''}`}
      width={isSmallScreen ? '100%' : isLG ? 260 : 360}
      collapsed={isSmallScreen ? !isCollapsed : isCollapsed}
      trigger={isSmallScreen ? MTrigger : Trigger}
      collapsible
      collapsedWidth={64}>
      <ItemsSideMenu />
    </Layout.Sider>
  );
}
