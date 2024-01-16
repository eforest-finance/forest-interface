import BackArrow from 'assets/images/backArrow.svg';
import ImgLoading from 'baseComponents/ImgLoading';
import { useParams, useRouter } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';
import styles from './BackTitle.module.css';

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
          <ImgLoading
            className={styles['sale-info-img']}
            nextImageProps={{ width: 48, height: 48 }}
            src={nftInfo?.previewImage ?? ''}
          />
          <div className={styles['information']}>
            <p>{nftInfo?.nftCollection?.tokenName ?? ''}</p>
            <h5>{nftInfo?.tokenName ?? ''}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
