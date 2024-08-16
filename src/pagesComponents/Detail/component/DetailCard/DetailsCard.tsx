import { Tooltip } from 'antd';
import NetWorkIcon from 'assets/images/network.svg';
import Copy from 'components/Copy';
import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { useMemo } from 'react';

import { Ellipsis } from 'antd-mobile';
import { formatTokenPrice } from 'utils/format';
import BigNumber from 'bignumber.js';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
}
export function DetailCard() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const items = useMemo(() => {
    const totalQuantity = BigNumber(nftInfo?.totalQuantity || 0)
      .dividedBy(10 ** Number(nftInfo?.decimals || 0))
      .toFixed(0)
      .toString();
    const arr = [
      {
        key: FilterKeyEnum.Details,
        header: <div className={styles.title}>Details</div>,
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p>
              <span>Symbol</span>
              <Tooltip title={nftInfo?.nftSymbol}>
                <span className="font-medium text-[var(--text10)] max-w-[176px] lg:max-w-[200px]">
                  <Ellipsis direction="middle" content={String(nftInfo?.nftSymbol || '')} />
                </span>
              </Tooltip>
            </p>
            <p>
              <span>Token ID</span>
              <Tooltip title={nftInfo?.nftTokenId}>
                <span className="font-medium text-[var(--text10)] max-w-[176px] lg:max-w-[200px]">
                  <Ellipsis direction="middle" content={String(nftInfo?.nftTokenId || '')} />
                </span>
              </Tooltip>
            </p>
            <p>
              <span>Blockchain</span>
              <span className="font-medium text-[var(--text10)]">{nftInfo?.issueChainIdStr || '--'}</span>
            </p>
            <p>
              <span className="flex min-w-[max-content] mr-[8px] leading-1.75">Base Url</span>
              {nftInfo?.nftCollection?.baseUrl ? (
                <span
                  className={styles['detail-icon']}
                  onClick={() => {
                    window.open(nftInfo?.nftCollection?.baseUrl);
                  }}>
                  <NetWorkIcon />
                </span>
              ) : (
                <span className="font-medium text-[var(--text10)]">--</span>
              )}
            </p>
            <p>
              <span className="flex min-w-[max-content] mr-[8px] leading-1.75">Url</span>
              {nftInfo?.uri ? (
                <span
                  className={styles['detail-icon']}
                  onClick={() => {
                    window.open(nftInfo?.uri || '');
                  }}>
                  <NetWorkIcon />
                </span>
              ) : (
                <span className="font-medium text-[var(--text10)]">--</span>
              )}
            </p>
            <p>
              <span>Metadata</span>
              {nftInfo?.metadata ? (
                <span>
                  <Copy className="copy-svg" toCopy={JSON.stringify(nftInfo?.metadata)} />
                </span>
              ) : null}
            </p>
            <p>
              <span>Total Supply</span>
              <Tooltip title={formatTokenPrice(totalQuantity || '')} overlayInnerStyle={{ textAlign: 'center' }}>
                <span className="font-medium text-[var(--text10)] max-w-[176px] lg:max-w-[200px]">
                  <Ellipsis direction="middle" content={formatTokenPrice(totalQuantity || '')} />
                </span>
              </Tooltip>
            </p>
          </div>
        ),
      },
    ];
    return arr;
  }, [
    nftInfo?.decimals,
    nftInfo?.issueChainIdStr,
    nftInfo?.metadata,
    nftInfo?.nftCollection?.baseUrl,
    nftInfo?.nftSymbol,
    nftInfo?.nftTokenId,
    nftInfo?.totalQuantity,
    nftInfo?.uri,
  ]);

  return <CollapseForPC defaultActiveKey={FilterKeyEnum.Details} items={items} wrapClassName={styles['detail-card']} />;
}
