import { Tooltip } from 'antd';
import UsernameMark from 'assets/images/usernameMark.svg';
import Copy from 'components/Copy';
import CollapseForPC from 'components/Collapse';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { OmittedType, addPrefixSuffix, getOmittedStr, getExploreLink } from 'utils';
import { useMemo } from 'react';
import useJumpExplorer from 'hooks/useJumpExplorer';
import useGetState from 'store/state/getState';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
}
export function DescriptionCard() {
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
    ];
    return arr;
  }, [nav, nftInfo?.minter, renderDescription, showName]);

  return (
    <CollapseForPC defaultActiveKey={FilterKeyEnum.Description} items={items} wrapClassName={styles['detail-card']} />
  );
}
