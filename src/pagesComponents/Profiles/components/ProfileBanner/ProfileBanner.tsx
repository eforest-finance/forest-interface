import { Avatar, message } from 'antd';
import styles from './ProfileBanner.module.css';

import Email from 'assets/images/icons/email.svg';
import Instagram from 'assets/images/icons/instagram.svg';
import Twitter from 'assets/images/icons/twitter.svg';
import { useCopyToClipboard } from 'react-use';
import { useSelector } from 'store/store';
import Copy from 'components/Copy';

import Image from 'next/image';
import AvatarDefault from 'assets/images/avatar.png';

import { OmittedType, getOmittedStr } from 'utils';

export default function ProfileBanner({
  bannerImage,
  profileImage,
  name,
  address,
  email,
  twitter,
  instagram,
}: {
  bannerImage: string;
  profileImage: string;
  name: string;
  address: string;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
}) {
  const [, setCopied] = useCopyToClipboard();
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  return (
    <div
      className={styles['profile-banner-wrapper']}
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}>
      <div className={`${styles['profile-banner-mask']} ${bannerImage ? styles['shadow'] : ''}`}>
        <Avatar
          className={`border border-solid border-[var(--line-box)] ${
            isSmallScreen ? styles['avatar-m'] : styles['avatar-pc']
          }`}
          icon={
            <Image src={profileImage || AvatarDefault} className="pointer-events-none" alt="" width={96} height={96} />
          }
          alt="Avatar"
        />
        <div className={styles['user-name']}>{name || 'Unnamed'}</div>
        <div className="flex items-center justify-center">
          <div className={styles['user-address']}>{getOmittedStr(address, OmittedType.ADDRESS)}</div>
          <Copy className="w-4 h-4 fill-textSecondary ml-2 cursor-pointer hover:fill-brandNormal" toCopy={address} />
        </div>
      </div>
    </div>
  );
}
