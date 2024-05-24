import LandingWallet from 'assets/images/LandingWallet.svg';
import LandingItems from 'assets/images/LandingItems.svg';
import LandingProtocol from 'assets/images/LandingProtocol.svg';
import LandingSale from 'assets/images/LandingSale.svg';

import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';

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

  return (
    <section className="w-full">
      <div className="lex justify-between items-center mt-8 mb-4 mdTW:mt-12 text-textPrimary text-xl mdTW:text-2xl font-semibold ">
        Getting Started
      </div>
      <ul className=" grid grid-cols-1 gap-x-5 gap-y-4 mdTW:grid-cols-2 xlTW:grid-cols-4 list-none !mb-0">
        {activeItems.map((item) => {
          if (item.key === 1) {
            return (
              <a
                href={item.link}
                key={item.key}
                target={!item.link || isSmallScreen ? '_self' : '_blank'}
                rel="noreferrer">
                <li className="pt-10 pb-12 px-8 rounded-lg text-center h-full bg-fillPageBg border-solid border border-lineBorder hover:bg-fillHoverBg">
                  <div className=" text-center flex justify-center items-center">{item.icon}</div>
                  <div className="mt-9 font-semibold text-xl text-textPrimary">{item.title}</div>
                  <p className=" mt-4 font-medium text-base text-textSecondary">{item.introduction}</p>
                </li>
              </a>
            );
          } else {
            return (
              <AuthNavLink to={item.link} key={item.key}>
                <li className="pt-10 pb-12 px-8 rounded-lg text-center h-full bg-fillPageBg border-solid border border-lineBorder hover:bg-fillHoverBg">
                  <div className=" text-center flex justify-center items-center">{item.icon}</div>
                  <div className="mt-9 font-semibold text-xl text-textPrimary">{item.title}</div>
                  <p className=" mt-4 font-medium text-base text-textSecondary">{item.introduction}</p>
                </li>
              </AuthNavLink>
            );
          }
        })}
      </ul>
    </section>
  );
}
