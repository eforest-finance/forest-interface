import PreviewCard from '../PreviewCard';
import SetItems from '../SetItems/SetItems';

import useGetState from 'store/state/getState';
import styles from './SetItemsWrap.module.css';
import FormItem from 'components/FormItem/FormItem';

export default function SetItemsWrap() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  return (
    <div className={`${styles['sale-setting-wrapper']} ${isSmallScreen && styles['sale-setting-wrapper-mobile']}`}>
      <h3 className={styles['sale-setting-title']}>List item for sale</h3>
      <div className={`flex ${styles['sale-setting-content']}`}>
        <SetItems />
        <div>
          <FormItem title="Preview">
            <PreviewCard />
          </FormItem>
        </div>
      </div>
    </div>
  );
}
