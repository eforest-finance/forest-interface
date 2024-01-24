import { Card } from 'antd';
import ImgLoading from 'components/ImgLoading';
import Logo from 'components/Logo';
import { useSelector } from 'store/store';
import { useMemo } from 'react';
import { INftInfo } from 'types/nftTypes';
import { unitConverter } from 'utils/unitConverter';
import styles from './ItemsCard.module.css';
import StarD from 'assets/images/night/star.svg';
import StarL from 'assets/images/light/star.svg';
import { useTheme } from 'hooks/useTheme';
import ELFPng from 'assets/images/ELF.png';
import { SYMBOL_TYPE } from 'constants/Symbol';
import { COLLECTION_DEFAULT_IMG } from 'constants/FileConfig';
import Button from 'baseComponents/Button';
import { formatTokenPrice } from 'utils/format';

interface ItemsCardProps {
  dataSource?: INftInfo;
  extraActions?: React.ReactNode;
  hiddenActions?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const isTrueOrZero = (n?: number) => {
  if (n || n === 0) return true;
  return false;
};

export default function ItemsCard({ dataSource, extraActions, hiddenActions, onClick }: ItemsCardProps) {
  const {
    walletInfo: { address },
  } = useSelector((store) => store.userInfo);
  const [theme] = useTheme();
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const src = dataSource?.listingToken?.symbol === SYMBOL_TYPE.ELF ? ELFPng : '';
  const lastSrc = dataSource?.latestDealToken?.symbol === SYMBOL_TYPE.ELF ? ELFPng : '';
  const whitelistSrc = dataSource?.whitelistPriceToken?.symbol === SYMBOL_TYPE.ELF ? ELFPng : '';
  const convertType = useMemo(() => {
    if (dataSource?.fileExtension === 'mp3') return 'audio';
    if (dataSource?.fileExtension === 'mp4') return 'video';
    return 'image';
  }, [dataSource?.fileExtension]);
  const metaLogoImage = dataSource?.metadata?.find?.(
    (meta: { key: string; value: string }) => meta.key === '__nft_image_url',
  );
  return (
    <Card
      onClick={onClick}
      className={`${styles['items-card-wrapper']} h-full`}
      cover={
        <>
          {convertType !== 'image' && <div className={styles['mark']}>{dataSource?.fileExtension?.toUpperCase()}</div>}
          <div className="border-x-0 border-y-0 border-b-[1px] border-solid border-[var(--line-dividers)]">
            <ImgLoading
              nextImageProps={{ width: 200, height: 200, className: '!object-contain' }}
              src={`${dataSource?.previewImage || metaLogoImage?.value || COLLECTION_DEFAULT_IMG}`}
            />
          </div>
        </>
      }
      bordered>
      <div className={styles['items-info-wrapper']}>
        <div className={`${styles['items-title']} ${styles['username-items']}`}>
          <div className={`${styles['title']} ${styles['items-user-name']} flex items-center`}>
            <span className={styles['text-name']}>
              {(dataSource?.nftCollection || dataSource?.nftCollection)?.tokenName ?? '--'}
            </span>
            {dataSource?.isOfficial && (
              <span className={styles['badge']}>{theme === 'dark' ? <StarD /> : <StarL />}</span>
            )}
          </div>
          <div className={`${styles['value']} ${styles['numbering']}`}>{dataSource?.tokenName || '--'}</div>
        </div>

        {isTrueOrZero(dataSource?.listingPrice) && (
          <div className={`${styles['items-title']} ${styles['price-items']}`}>
            <div className={`${styles['title']} ${styles['items-price-title']}`}>
              {isSmallScreen && (
                <Logo className={isSmallScreen ? 'flex w-[12px] h-[12px]' : 'flex w-[16px] h-[16px]'} src={src} />
              )}
              Price
            </div>
            <div className={`${styles['value']} ${styles['price']} flex items-center justify-end`}>
              {isSmallScreen || (
                <Logo className={isSmallScreen ? 'flex w-[12px] h-[12px]' : 'flex w-[16px] h-[16px]'} src={src} />
              )}
              <span className={styles['price-value']}>
                {dataSource?.listingPrice ? formatTokenPrice(dataSource?.listingPrice ?? 0) : ''}
              </span>
            </div>
          </div>
        )}
      </div>
      {((isTrueOrZero(dataSource?.latestDealPrice) && !!lastSrc) ||
        (isTrueOrZero(dataSource?.whitelistPrice) && !!whitelistSrc)) && (
        <div className={styles['items-price']}>
          <div className={`${styles['items-last-price']} flex items-center`}>
            <span className={styles['text']}>{dataSource?.whitelistPrice ? 'Whitelist price' : 'Last'}</span>
            <div className={`${styles['price']} flex items-center`}>
              <Logo className="flex w-[12px] h-[12px]" src={dataSource?.whitelistPrice ? whitelistSrc : lastSrc} />
              <span className={`${styles['price-value']} text-[var(--color-secondary)]`}>
                {formatTokenPrice((dataSource?.whitelistPrice || dataSource?.latestDealPrice) ?? 0)}
              </span>
            </div>
          </div>
        </div>
      )}
      {extraActions}
      {!extraActions && !hiddenActions && dataSource?.listingAddress !== null && !!dataSource?.canBuyFlag && (
        <div className={styles['items-card-action']}>
          <Button size="middle" type="default">
            Buy Now
          </Button>
        </div>
      )}
    </Card>
  );
}
