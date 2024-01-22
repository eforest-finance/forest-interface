import styles from './ActiveWrapper.module.css';
import { useRouter } from 'next/navigation';
import { selectInfo } from 'store/reducer/info';
import { useSelector } from 'react-redux';
import Button from 'baseComponents/Button';

export default function ActiveWrapper() {
  const router = useRouter();
  const { isSmallScreen } = useSelector(selectInfo);

  return (
    <div className={`${isSmallScreen ? styles['marketplace-mobile'] : ''} ${styles['active-wrapper']}`}>
      <div className={styles['active-content']}>
        <div>
          <h5 className={styles['active-title']}>aelf Hackathon</h5>
          <p>Be a pioneer in aelf hackathon, make contribution to aelf ecosystem together!</p>
        </div>
        <Button
          type="default"
          className={isSmallScreen ? 'w-full' : ''}
          size={isSmallScreen ? 'large' : 'ultra'}
          onClick={() => router.push('/activity')}>
          GO
        </Button>
      </div>
    </div>
  );
}
