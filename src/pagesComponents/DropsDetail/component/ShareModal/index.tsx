import Modal from 'baseComponents/Modal';
import React from 'react';
import Image from 'next/image';
import TwitterX from 'assets/images/icons/twitterX.svg';
import Telegram from 'assets/images/icons/telegram.svg';
import Facebook from 'assets/images/icons/facebook.svg';
import Copy from 'assets/images/icons/copy.svg';
import styles from './index.module.css';
import useGetState from 'store/state/getState';
import clsx from 'clsx';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useDropDetailGetState from 'store/state/dropDetailGetState';

function ShareModal() {
  const { infoState } = useGetState();
  const { dropDetailInfo } = useDropDetailGetState();

  const { isSmallScreen } = infoState;
  const modal = useModal();
  return (
    <Modal open={modal.visible} title="Share" footer={null} onCancel={modal.hide} afterClose={modal.remove}>
      <div className="w-full h-auto overflow-hidden rounded-lg">
        <Image
          width={343}
          height={343}
          src={dropDetailInfo?.logoUrl || ''}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xl mdTW:text-2xl text-textPrimary font-semibold mt-[64px] mdTW:mt-[32px] text-center">
        NFT Collection Name x Activity Name
      </p>
      <div className={clsx(styles['share-modal-svg'], isSmallScreen && styles['share-modal-svg-mobile'])}>
        <div>
          <div className={styles['share-modal-svg-twitter']}>
            <TwitterX />
          </div>
          <span className={styles.text}>Twitter</span>
        </div>
        <div>
          <div className={styles['share-modal-svg-telegram']}>
            <Telegram />
          </div>
          <span className={styles.text}>Telegram</span>
        </div>
        <div>
          <div className={styles['share-modal-svg-facebook']}>
            <Facebook />
          </div>
          <span className={styles.text}>FaceBook</span>
        </div>
        <div>
          <div className={styles['share-modal-svg-copy']}>
            <Copy />
          </div>
          <span className={styles.text}>Copy</span>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(NiceModal.create(ShareModal));
