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
    title: 'First NFT marketplace on aelf blockchain',
    description: 'First NFT marketplace on aelf blockchain',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1726107869879-1200_630%20%282%29.png',
      // url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png',
    },
  },
  openGraph: {
    title: 'First NFT marketplace on aelf blockchain',
    description: 'First NFT marketplace on aelf blockchain',
    type: 'website',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1726107869879-1200_630%20%282%29.png',
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
