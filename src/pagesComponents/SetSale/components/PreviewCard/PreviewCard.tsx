import { Card } from 'antd';
import ImgLoading from 'components/ImgLoading';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { ellipsisString } from 'utils';
import { unitConverter } from 'utils/unitConverter';
import styles from './PreviewCard.module.css';
import useDetailGetState from 'store/state/detailGetState';
import useSaleInfoGetState from 'store/state/saleInfoGetState';
import useGetState from 'store/state/getState';

export default function PreviewCard() {
  const { detailInfo } = useDetailGetState();
  const { previewInfo } = useSaleInfoGetState();
  const { infoState } = useGetState();
  const { nftInfo } = detailInfo;
  const { isSmallScreen } = infoState;
  return (
    <Card
      className={`${styles['preview-card-wrapper']} ${isSmallScreen && styles['preview-card-wrapper-mobile']}`}
      cover={<ImgLoading src={nftInfo?.previewImage ?? ''} className={styles['preview-card-img-wrapper']} />}
      hoverable
      bordered>
      <div className={`${styles['items-info-wrapper']} flex items-center justify-between`}>
        <div className="inline-block">
          <div className={`${styles.title} ${styles['items-user-name']}`}>
            {ellipsisString(nftInfo?.nftCollection?.tokenName || '', 15)}
          </div>
          <div className={`${styles.value} ${styles.numbering}`}>{ellipsisString(nftInfo?.minter?.name || '', 15)}</div>
        </div>

        <div className={`inline-block ${styles['price-items']}`}>
          <div className={`${styles.title} ${styles['items-price']}`}>Price</div>
          <span className={`${styles.value} ${styles.price} flex items-center`}>
            <Logo className="flex w-[16px] h-[16px] mr-[4px]" src={ELF} />
            {unitConverter(previewInfo?.price)}
          </span>
        </div>
      </div>
    </Card>
  );
}
