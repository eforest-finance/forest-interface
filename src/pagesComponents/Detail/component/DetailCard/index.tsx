import { Tooltip } from 'antd';
import UsernameMark from 'assets/images/usernameMark.svg';
import NetWorkIcon from 'assets/images/network.svg';
import Copy from 'components/Copy';
import CollapseForPC from 'components/Collapse';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { OmittedType, addPrefixSuffix, getOmittedStr, getExploreLink } from 'utils';
import { useMemo } from 'react';
import moment from 'moment';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { Ellipsis } from 'antd-mobile';
import useGetState from 'store/state/getState';
import { formatTokenPrice, formatShowEmptyValue } from 'utils/format';
import BigNumber from 'bignumber.js';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
}
export default function DetailCard() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const nav = useRouter();
  const jump = useJumpExplorer();
  const { walletInfo } = useGetState();

  const renderDescription = nftInfo?.description ?? ' ';

  const showName = useMemo(() => {
    if (!nftInfo?.minter?.address) return '';
    if (walletInfo.address === nftInfo.minter.address) {
      return 'you';
    }
    if (nftInfo?.minter?.name) return getOmittedStr(nftInfo?.minter?.name, OmittedType.ADDRESS);
    return getOmittedStr(addPrefixSuffix(nftInfo.minter?.address), OmittedType.ADDRESS);
  }, [walletInfo.address, nftInfo?.minter]);

  const items = useMemo(() => {
    const totalQuantity = BigNumber(nftInfo?.totalQuantity || 0)
      .dividedBy(10 ** Number(nftInfo?.decimals || 0))
      .toFixed(0)
      .toString();
    const arr = [
      {
        key: FilterKeyEnum.Description,
        header: <div className={styles.title}>Description</div>,
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p className="!mb-0">
              {nftInfo?.minter && (
                <span className="flex items-center flex-row w-full">
                  <span className="mr-2">Created by</span>
                  <span className="creator text-[var(--brand-base)] flex items-center">
                    {nftInfo?.minter?.name ? (
                      <>
                        <span
                          className="cursor-pointer flex items-center"
                          onClick={() => {
                            if (nftInfo?.minter?.name?.endsWith?.('_AELF')) {
                              // jump('AELF', `/address/${nftInfo?.minter?.name}`);
                              const url = getExploreLink(`${nftInfo?.minter?.name}`, 'address', `AELF`);
                              window.open(url);
                              return;
                            }
                            nav.push(`/account/${nftInfo?.minter?.address}#Collected`);
                          }}>
                          {showName}
                        </span>
                        &nbsp;
                        <Copy className="copy-svg" toCopy={addPrefixSuffix(nftInfo?.minter?.address) || ''} />
                      </>
                    ) : (
                      <>
                        {showName}
                        &nbsp;&nbsp;&nbsp;
                        <Tooltip placement="bottom" title={addPrefixSuffix(nftInfo.minter?.address || '')}>
                          <span className="tooltip-svg w-[20px] h-[20px]">
                            <UsernameMark />
                          </span>
                        </Tooltip>
                        &nbsp;
                        <Copy className="copy-svg" toCopy={addPrefixSuffix(nftInfo.minter?.address || '')} />
                      </>
                    )}
                  </span>
                </span>
              )}
            </p>
            <p>
              <span>{renderDescription}</span>
            </p>
          </div>
        ),
      },
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
    if (nftInfo?.inscriptionInfo && Object.keys(nftInfo.inscriptionInfo).length > 0) {
      arr.push({
        key: FilterKeyEnum.CreateTokenInformation,
        header: <div className={styles.title}>Inscription Information</div>,
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p className="flex justify-between">
              <span className="flex min-w-fit mr-[16px]">Inscription Name</span>
              <span className="font-medium text-right break-all text-[var(--text10)]">
                {nftInfo?.inscriptionInfo.tick || '-'}
              </span>
            </p>
            {!nftInfo?.inscriptionInfo.issuedTransactionId ? null : (
              <p>
                <span>Inscription ID</span>
                <span
                  className="font-medium text-brandNormal cursor-pointer"
                  onClick={() =>
                    nftInfo?.inscriptionInfo?.issuedTransactionId &&
                    jump(nftInfo.chainId, `/tx/${nftInfo.inscriptionInfo.issuedTransactionId}`)
                  }>
                  {nftInfo?.inscriptionInfo.issuedTransactionId
                    ? getOmittedStr(nftInfo?.inscriptionInfo.issuedTransactionId, OmittedType.CUSTOM, {
                        prevLen: 6,
                        endLen: 6,
                        limitLen: 15,
                      })
                    : '-'}
                </span>
              </p>
            )}
            {!nftInfo.inscriptionInfo.deployTime ? null : (
              <p>
                <span>Deployment Time</span>
                <span className="font-medium text-[var(--text10)]">
                  {nftInfo?.inscriptionInfo.deployTime
                    ? `${moment(nftInfo.inscriptionInfo.deployTime).format('MMM DD YYYY HH:mm:ss')}`
                    : '-'}
                </span>
              </p>
            )}

            <p>
              <span>Limit Per Mint</span>
              <span className="font-medium text-[var(--text10)]">
                {formatShowEmptyValue(nftInfo?.inscriptionInfo.mintLimit)}
              </span>
            </p>
          </div>
        ),
      });
    }
    return arr;
  }, [
    jump,
    nav,
    nftInfo?.chainId,
    nftInfo?.createTokenInformation,
    nftInfo?.decimals,
    nftInfo?.inscriptionInfo,
    nftInfo?.issueChainIdStr,
    nftInfo?.metadata,
    nftInfo?.minter,
    nftInfo?.nftCollection?.baseUrl,
    nftInfo?.nftSymbol,
    nftInfo?.nftTokenId,
    nftInfo?.totalQuantity,
    nftInfo?.uri,
    renderDescription,
    showName,
  ]);

  return (
    <CollapseForPC
      defaultActiveKey={[FilterKeyEnum.Description, FilterKeyEnum.Details, FilterKeyEnum.CreateTokenInformation]}
      items={items}
      wrapClassName={styles['detail-card']}
    />
  );
}
