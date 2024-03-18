import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { OmittedType, getOmittedStr } from 'utils';
import { useMemo } from 'react';
import moment from 'moment';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { formatShowEmptyValue } from 'utils/format';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
  InscriptionInfo = 'InscriptionInfo',
}
export function InscriptionInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const jump = useJumpExplorer();

  const items = useMemo(() => {
    const arr = [];
    if (nftInfo?.inscriptionInfo && Object.keys(nftInfo.inscriptionInfo).length > 0) {
      arr.push({
        key: FilterKeyEnum.InscriptionInfo,
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
  }, [nftInfo?.inscriptionInfo]);

  if (!items.length) {
    return null;
  }
  return (
    <CollapseForPC
      defaultActiveKey={FilterKeyEnum.InscriptionInfo}
      items={items}
      wrapClassName={styles['detail-card']}
    />
  );
}
