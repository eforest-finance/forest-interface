import { MouseEventHandler } from 'react';
import ExchangeBtnPanel from '../ExchangeBtnPanel';
import useGetState from 'store/state/getState';

import styles from './style.module.css';

export default function SellCard(options: {
  loading: boolean;
  nftBalance: number;
  onTransfer: MouseEventHandler;
  quantity: number;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { nftBalance, onTransfer, loading } = options;
  if (!nftBalance) {
    return null;
  }

  return (
    <div className={`${styles['sell-card']} ${isSmallScreen && styles['mobile-sell-card']}`}>
      <div className={styles['title-panel']}>
        <span className={`text-textPrimary text-base font-medium`}>Number of Items owned</span>
      </div>
      <div
        className={`${styles['amount-panel']} p-[16px] lgTW:py-0 lgTW:px-[24px] flex-col items-start justify-between lgTW:flex-row lgTW:items-center`}>
        <div className={`${styles['left-part']} pb-0 lgTW:pb-[24px]`}>
          <p className={styles['current-amount']}>Current Number</p>
          <p className={styles['amount-number']}>
            <span className={styles['amount-margin']}>{!loading ? nftBalance ?? '--' : '--'}</span>
          </p>
        </div>
        <ExchangeBtnPanel
          className="btn-panel w-full lgTW:w-auto"
          nftBalance={nftBalance}
          onClickTransfer={onTransfer}
        />
      </div>
    </div>
  );
}
