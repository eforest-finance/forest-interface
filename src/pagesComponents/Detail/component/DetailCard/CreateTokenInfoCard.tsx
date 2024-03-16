import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { useMemo } from 'react';
import moment from 'moment';
import { arrayBuffer } from 'stream/consumers';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
}
export function CreateTokenInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const items = useMemo(() => {
    const arr = [];
    if (nftInfo?.createTokenInformation && Object.keys(nftInfo.createTokenInformation).length > 0) {
      arr.push({
        key: FilterKeyEnum.CreateTokenInformation,
        header: <div className={styles.title}>Token Creation via This SEED</div>,
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p>
              <span>Type</span>
              <span className="font-medium text-[var(--text10)]">{nftInfo?.createTokenInformation?.category}</span>
            </p>
            <p>
              <span>Token Symbol</span>
              <span className="font-medium text-[var(--text10)]">{nftInfo?.createTokenInformation?.tokenSymbol}</span>
            </p>
            <p>
              <span>Takes Effect</span>
              <span className="font-medium text-[var(--text10)]">
                {nftInfo?.createTokenInformation?.registered
                  ? `${moment.unix(nftInfo.createTokenInformation.registered).utc().format('MMM DD YYYY HH:mm:ss')} UTC`
                  : '-'}
              </span>
            </p>
            <p>
              <span>Expires</span>
              <span className="font-medium text-[var(--text10)]">
                {nftInfo?.createTokenInformation?.expires
                  ? `${moment.unix(nftInfo.createTokenInformation.expires).utc().format('MMM DD YYYY HH:mm:ss')} UTC`
                  : '-'}
              </span>
            </p>
          </div>
        ),
      });
    }
    return arr;
  }, [nftInfo?.createTokenInformation, nftInfo?.nftSymbol]);

  if (!items.length) {
    return null;
  }

  return (
    <CollapseForPC
      defaultActiveKey={FilterKeyEnum.CreateTokenInformation}
      items={items}
      wrapClassName={styles['detail-card']}
    />
  );
}
