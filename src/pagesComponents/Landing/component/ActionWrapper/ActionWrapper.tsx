import LandingWallet from 'assets/images/LandingWallet.svg';
import LandingItems from 'assets/images/LandingItems.svg';
import LandingProtocol from 'assets/images/LandingProtocol.svg';
import LandingSale from 'assets/images/LandingSale.svg';

import styles from './ActionWrapper.module.css';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import { useTheme } from 'hooks/useTheme';

const activeItems = [
  {
    key: 1,
    icon: <LandingWallet />,
    link: 'https://portkey.finance/',
    title: 'Set up Your Wallet',
    introduction: `Once you've installed the wallet and registered your account, connect it to Forest by clicking the "wallet" icon in the top right corner. `,
  },
  {
    key: 2,
    icon: <LandingProtocol />,
    title: 'Create Your Collection',
    link: '/create-collection',
    introduction: `Collection is a set of NFTs with certain themes or shared features. For each Collection, you can add Collection names, logos, featured images, descriptions, etc.`,
  },
  {
    key: 3,
    icon: <LandingItems />,
    title: 'Add Your Items',
    link: '/create-item',
    introduction: `Create your NFTs by uploading your works (image, video, audio) and setting item names, quantities, owners, metadata, Token IDs, etc. `,
  },
  {
    key: 4,
    icon: <LandingSale />,
    title: 'List Items for Sale',
    link: '/my-collections',
    introduction: `Price your NFTs so that they can be listed and traded. Meanwhile, you can create a whitelist of users who can buy your NFTs at the pre-set prices.`,
  },
];

export default function ActionWrapper() {
  const { isSmallScreen } = useSelector(selectInfo);

  const [theme] = useTheme();

  return (
    <div className={`${isSmallScreen ? styles['marketplace-mobile'] : ''} ${styles['landing-action-wrapper']}`}>
      <h3 className={styles['title-wrapper']}>Create and sell your NFTs</h3>
      <ul className={styles['action-wrapper']}>
        {activeItems.map((item) => {
          if (item.key === 1) {
            return (
              <a
                href={item.link}
                key={item.key}
                target={!item.link || isSmallScreen ? '_self' : '_blank'}
                rel="noreferrer">
                <li className={`${styles['action-list-item']} ${theme === 'dark' && '!border-none'}`}>
                  <div className={styles['icon-wrapper']}>{item.icon}</div>
                  <h5>{item.title}</h5>
                  <p>{item.introduction}</p>
                </li>
              </a>
            );
          } else {
            return (
              <AuthNavLink to={item.link} key={item.key}>
                <li className={`${styles['action-list-item']} ${theme === 'dark' && '!border-none'}`}>
                  <div className={styles['icon-wrapper']}>{item.icon}</div>
                  <h5>{item.title}</h5>
                  <p>{item.introduction}</p>
                </li>
              </AuthNavLink>
            );
          }
        })}
      </ul>
    </div>
  );
}
