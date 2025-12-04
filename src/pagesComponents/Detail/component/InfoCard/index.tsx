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
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
}
export function DetailCard() {
  const { isSmallScreen } = useSelector(selectInfo);
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const totalQuantity = useMemo(() => {
    const totalQuantity = BigNumber(nftInfo?.totalQuantity || 0)
      .dividedBy(10 ** Number(nftInfo?.decimals || 0))
      .toFixed(0)
      .toString();
    return totalQuantity;
  }, [nftInfo?.decimals, nftInfo?.totalQuantity]);

  return (
    <div className={styles[!isSmallScreen ? 'detail-card' : 'mobile-detail-card']}>
      <div className="p-[16px] pt-0 lg:p-0">
        <p className="mdTW:h-[51px]">
          <span>Token Symbol</span>
          <Tooltip title={nftInfo?.nftSymbol}>
            <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary max-w-[176px] lg:max-w-[200px]">
              <Ellipsis direction="middle" content={String(nftInfo?.nftSymbol || '')} />
            </span>
          </Tooltip>
        </p>
        <p className="mdTW:h-[51px]">
          <span>Token ID</span>
          <Tooltip title={nftInfo?.nftTokenId}>
            <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary max-w-[176px] lg:max-w-[200px]">
              <Ellipsis direction="middle" content={String(nftInfo?.nftTokenId || '')} />
            </span>
          </Tooltip>
        </p>
        <p className="mdTW:h-[51px]">
          <span>Network</span>
          <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary">
            {/* {nftInfo?.issueChainIdStr || '--'} */}
            {nftInfo?.issueChainIdStr ? 'aelf dAppChain' : '--'}
          </span>
        </p>
        <p className="mdTW:h-[51px]">
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
            <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary">--</span>
          )}
        </p>
        <p className="mdTW:h-[51px]">
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
            <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary">--</span>
          )}
        </p>
        <p className="mdTW:h-[51px]">
          <span>Metadata</span>
          {nftInfo?.metadata ? (
            <span>
              <Copy className="copy-svg" toCopy={JSON.stringify(nftInfo?.metadata)} />
            </span>
          ) : null}
        </p>
        <p className="mdTW:h-[51px]">
          <span>Total Supply</span>
          <Tooltip title={formatTokenPrice(totalQuantity || '')} overlayInnerStyle={{ textAlign: 'center' }}>
            <span className="font-medium text-[14px] lg:text-[16px] text-textPrimary max-w-[176px] lg:max-w-[200px]">
              <Ellipsis direction="middle" content={formatTokenPrice(totalQuantity || '')} />
            </span>
          </Tooltip>
        </p>
      </div>
    </div>
  );
}
