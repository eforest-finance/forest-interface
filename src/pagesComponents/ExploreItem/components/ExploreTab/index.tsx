import { Tabs, TabsProps } from 'antd';
import styles from './style.module.css';
export function ExploreTab(tabProps: TabsProps) {
  return <Tabs {...tabProps} className={styles.custom__tabs} />;
}
