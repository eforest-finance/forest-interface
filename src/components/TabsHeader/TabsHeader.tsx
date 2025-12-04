import { Image, Space, TabPaneProps, Tabs, TabsProps } from 'antd';
import { useSelector } from 'store/store';
import styles from './TabsHeader.module.css';
export interface TabNavType extends TabPaneProps {
  title: string;
  key: string;
  icon?: React.ReactNode;
  tips?: React.ReactNode | string;
  element?: React.ReactNode;
}
export interface TabsHeaderProps {
  tabNav: TabNavType[];
  onChange?: (v: string) => void;
}
const TabWrapper = ({ icon, item }: { icon?: React.ReactNode; item: TabNavType }) => {
  return (
    <div className={`flex justify-between items-center`}>
      <Space className={styles['tabs-title']} size={15}>
        {icon ?? null}
        {item.title}
      </Space>
      {typeof item?.tips === 'string' ? (
        <span className={styles['tab-nav-tips']}>{item.tips}</span>
      ) : typeof item?.tips === 'object' ? (
        item?.tips
      ) : null}

      {item?.tips || item?.tips === 0 ? (
        typeof item?.tips === 'object' ? (
          item?.tips
        ) : (
          <span className={styles['tab-nav-tips']}>{item.tips}</span>
        )
      ) : null}
    </div>
  );
};

export default function TabsHeader({ tabNav, activeKey, onChange, ...props }: TabsHeaderProps & TabsProps) {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  console.log('tabNav', tabNav);
  return (
    <Tabs
      tabBarGutter={0}
      activeKey={activeKey || tabNav?.[0]?.key}
      className={`${styles['tabs-header']} ${isSmallScreen ? styles['mobile-tabs-header'] : ''}`}
      onChange={onChange}
      {...props}>
      {tabNav
        .filter((item) => item.key || item.title)
        .map((item) => {
          let icon = item.icon;
          if (typeof item.icon === 'string') {
            icon = <Image src={item.icon} alt="" preview={false} />;
          }
          return <Tabs.TabPane {...item} tab={<TabWrapper icon={icon} item={item} />} key={item.key} />;
        })}
    </Tabs>
  );
}
