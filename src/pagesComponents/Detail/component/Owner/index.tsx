import { useParams, useRouter } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { memo, useCallback, useMemo, useState } from 'react';
import { Divider } from 'antd';
import Tooltip from 'baseComponents/Tooltip';
import styles from './style.module.css';
import OwnersList from '../OwnersList';
import useGetState from 'store/state/getState';
import { formatNumber, formatTokenPrice } from 'utils/format';

import Owners from 'assets/images/v2/owners.svg';
import OwnerXS from 'assets/images/v2/user_xs.svg';

import ItemIcon from 'assets/images/v2/items.svg';
import { Ellipsis } from 'antd-mobile';
import BigNumber from 'bignumber.js';

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

  const totalQuantity = useMemo(() => {
    const totalQuantity = BigNumber(nftInfo?.totalQuantity || 0)
      .dividedBy(10 ** Number(nftInfo?.decimals || 0))
      .toFixed(0)
      .toString();
    return totalQuantity;
  }, [nftInfo?.decimals, nftInfo?.totalQuantity]);

  const Items = useCallback(
    () => (
      <>
        <ItemIcon /> <span className={styles.title}>Items</span>
        <span className="font-medium text-[12px] text-textPrimary  max-w-[176px] lg:max-w-[200px]">
          <Ellipsis direction="middle" content={formatTokenPrice(totalQuantity || '')} />
        </span>
      </>
    ),
    [className, nftInfo],
  );

  const OwnerERC721 = useMemo(
    () =>
      nftInfo && nftInfo?.owner ? (
        <div className={styles.owner}>
          <Items />
          <Divider type="vertical" className="mx-[12px]" />
          <OwnerXS />
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
          <Items />
          <Divider type="vertical" className="mx-[12px]" />
          <Owners /> <span className={styles.title}>{nftInfo?.ownerCount === 1 ? 'owner' : 'owners'}</span>
          <span className={styles.value} onClick={showOwnersList}>
            {formatNumber(nftInfo?.ownerCount)}
          </span>
          <OwnersList id={id} chainId={chainId} visible={visible} onCancel={() => setVisible(false)} />
        </div>
      ) : null,
    [className, nftInfo, visible],
  );

  return isERC721 ? OwnerERC721 : OwnerERC1155;
};

export default memo(Owner);
