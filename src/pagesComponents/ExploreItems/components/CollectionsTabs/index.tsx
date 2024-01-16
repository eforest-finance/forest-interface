import { Tabs, TabsProps } from 'antd';
import styles from './styles.module.css';
export default function CollectionTabs(tabProps: TabsProps) {
  return <Tabs {...tabProps} className={styles.custom__tabs} />;
}
