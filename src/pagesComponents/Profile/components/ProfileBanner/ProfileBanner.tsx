import { Avatar, message } from 'antd';
import styles from './ProfileBanner.module.css';

import Email from 'assets/images/icons/email.svg';
import Instagram from 'assets/images/icons/instagram.svg';
import Twitter from 'assets/images/icons/twitter.svg';
import { useCopyToClipboard } from 'react-use';
import { useSelector } from 'store/store';

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
        <div className={styles['user-address']}>{getOmittedStr(address, OmittedType.ADDRESS)}</div>
        <div className={styles['links']}>
          {!!email && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setCopied(email || '');
                message.success('Copied');
              }}>
              <Email />
            </span>
          )}
          {!!twitter &&
            (isSmallScreen ? (
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  setCopied(twitter.includes('http') ? twitter : `https://${twitter}`);
                  message.success('Copied');
                }}>
                <Twitter />
              </a>
            ) : (
              <a href={twitter.includes('http') ? twitter : `https://${twitter}`} target="_blank" rel="noreferrer">
                <Twitter />
              </a>
            ))}
          {!!instagram &&
            (isSmallScreen ? (
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  setCopied(instagram.includes('http') ? instagram : `https://${instagram}`);
                  message.success('Copied');
                }}>
                <Instagram />
              </a>
            ) : (
              <a
                href={instagram.includes('http') ? instagram : `https://${instagram}`}
                target="_blank"
                rel="noreferrer">
                <Instagram />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
