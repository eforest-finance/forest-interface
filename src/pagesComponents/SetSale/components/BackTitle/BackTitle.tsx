import BackArrow from 'assets/images/backArrow.svg';
import { useParams, useRouter } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';
import styles from './BackTitle.module.css';
import { ImageEnhance } from 'components/ImgLoading/ImgLoadingEnhance';

export default function BackTitle() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const navigate = useRouter();
  const { id, chainId } = useParams();
  return (
    <div className={`${styles['sale-setting-backtitle-wrapper']} bg-[var(--bg-dark)]`}>
      <div className={styles['sale-setting-backtitle-content']}>
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate.push(`/detail/sell/${id}/${chainId}`);
          }}>
          <BackArrow />
        </div>

        <div className={styles['sale-information']}>
          <ImageEnhance className={styles['sale-info-img']} src={nftInfo?.previewImage ?? ''} />
          <div className={styles['information']}>
            <p>{nftInfo?.nftCollection?.tokenName ?? ''}</p>
            <h5>{nftInfo?.tokenName ?? ''}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
