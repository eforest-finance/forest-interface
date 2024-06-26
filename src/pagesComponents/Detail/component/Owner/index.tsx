import { useParams, useRouter } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { memo, useMemo, useState } from 'react';
import Tooltip from 'baseComponents/Tooltip';
import styles from './style.module.css';
import OwnersList from '../OwnersList';
import useGetState from 'store/state/getState';
import { formatNumber } from 'utils/format';

const Owner = ({ className, isERC721 }: { className?: string; isERC721?: boolean }) => {
  const nav = useRouter();
  const jump = useJumpExplorer();
  const { walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { id, chainId } = useParams() as {
    id: string;
    chainId: Chain;
  };

  const [visible, setVisible] = useState<boolean>(false);

  const toPageAccount = () => {
    if (nftInfo?.owner?.name?.endsWith?.('_AELF')) {
      jump('AELF', `/address/${nftInfo?.owner?.name}`);
      return;
    }
    if (nftInfo?.owner?.address) {
      nav.push(`/account/${nftInfo.owner.address}#Collected`);
    }
  };

  const showOwnersList = () => {
    setVisible(true);
  };

  const OwnerERC721 = useMemo(
    () =>
      nftInfo && nftInfo?.owner ? (
        <div className={styles.owner}>
          <span className={styles.title}>Owned by &nbsp;</span>
          <Tooltip title={addPrefixSuffix(nftInfo?.owner?.address)}>
            <span className={styles.value} onClick={toPageAccount}>
              {nftInfo.owner.address === walletInfo.address
                ? 'you'
                : getOmittedStr(nftInfo?.owner?.name || '', OmittedType.ADDRESS) || ''}
            </span>
          </Tooltip>
        </div>
      ) : null,
    [className, nftInfo],
  );

  const OwnerERC1155 = useMemo(
    () =>
      nftInfo && nftInfo?.owner ? (
        <div className={styles.owner}>
          <Tooltip
            title={nftInfo?.ownerCount}
            trigger={'hover'}
            zIndex={999}
            overlayInnerStyle={{ textAlign: 'center' }}>
            <span className={styles.value} onClick={showOwnersList}>
              {formatNumber(nftInfo?.ownerCount)}
            </span>
          </Tooltip>
          <span className={styles.title}>{nftInfo?.ownerCount === 1 ? 'owner' : 'owners'}</span>

          <OwnersList id={id} chainId={chainId} visible={visible} onCancel={() => setVisible(false)} />
        </div>
      ) : null,
    [className, nftInfo, visible],
  );

  return isERC721 ? OwnerERC721 : OwnerERC1155;
};

export default memo(Owner);
