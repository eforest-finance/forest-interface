import '../styles/base.css';

import 'antd/dist/antd.css';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import Provider from '../providers/provider';

import Layout from 'pagesComponents/Layout';

import '../styles/global.css';
import '../styles/theme.css';

// export const metadata = {
//   title: 'Forest',
//   description: 'Forest',
// };

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forest',
  description: 'Forest',
  twitter: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    images: {
      width: 1200,
      height: 675,
      url: 'https://looksrare.mo.cloudinary.net/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/0x7fa4427abb4304f7797a5ac2e95ff82965a61af6bfd81a9363f2acfaa23fb1ca?resource_type=image&f=auto&c=limit&w=1200&q=auto',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
  openGraph: {
    title: 'title: test share nft to X',
    description: 'description: test share nft to X',
    type: 'website',
    images: {
      width: 1200,
      height: 675,
      url: 'https://looksrare.mo.cloudinary.net/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/0x7fa4427abb4304f7797a5ac2e95ff82965a61af6bfd81a9363f2acfaa23fb1ca?resource_type=image&f=auto&c=limit&w=1200&q=auto',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
