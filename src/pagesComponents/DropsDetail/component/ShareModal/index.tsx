import Modal from 'baseComponents/Modal';
import React from 'react';
import Image from 'next/image';
import TwitterX from 'assets/images/icons/twitterX.svg';
import Telegram from 'assets/images/icons/telegram.svg';
import Facebook from 'assets/images/icons/facebook_32.svg';
import Copy from 'assets/images/icons/copy.svg';
import styles from './index.module.css';
import useGetState from 'store/state/getState';
import clsx from 'clsx';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { useCopyToClipboard } from 'react-use';
import { message } from 'antd';

function ShareModal() {
  const { infoState } = useGetState();
  const { dropDetailInfo } = useDropDetailGetState();
  const href = window.location.href;
  const [, setCopied] = useCopyToClipboard();

  const { isSmallScreen } = infoState;
  const modal = useModal();

  const shareList = [
    {
      icon: <TwitterX />,
      className: styles['share-modal-svg-twitter'],
      text: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${href}`,
    },
    {
      icon: <Telegram />,
      className: styles['share-modal-svg-telegram'],
      text: 'Telegram',
      href: `https://t.me/share/url?url=${href}`,
    },
    {
      icon: <Facebook />,
      className: styles['share-modal-svg-facebook'],
      text: 'FaceBook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${href}`,
    },
    {
      icon: <Copy />,
      className: styles['share-modal-svg-copy'],
      text: 'Copy',
      handle: () => {
        setCopied(href);
        message.success('Copied');
      },
    },
  ];

  return (
    <Modal open={modal.visible} title="Share" footer={null} onCancel={modal.hide} afterClose={modal.remove}>
      {dropDetailInfo?.bannerUrl ? (
        <div className="w-full h-[172px] overflow-hidden rounded-lg">
          <Image
            width={736}
            height={172}
            src={dropDetailInfo.bannerUrl}
            alt="banner"
            className="w-full h-[172px] object-cover"
          />
        </div>
      ) : null}

      <p className="text-xl mdTW:text-2xl text-textPrimary font-semibold mt-[64px] mdTW:mt-[32px] text-center">
        {dropDetailInfo?.dropName}
      </p>
      <div className={clsx(styles['share-modal-svg'], isSmallScreen && styles['share-modal-svg-mobile'])}>
        {shareList.map((item, index) => {
          return (
            <div key={index}>
              <a
                href={item.href}
                className={styles['share-card']}
                target="_blank"
                rel="noopener noreferrer"
                onClick={item?.handle}>
                <div className={clsx(item.className, styles['share-icon'])}>{item.icon}</div>
                <span className={styles.text}>{item.text}</span>
              </a>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default React.memo(NiceModal.create(ShareModal));
