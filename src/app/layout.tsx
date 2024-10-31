import '../styles/base.css';

import 'antd/dist/antd.css';

import Provider from '../providers/provider';

import Layout from 'pagesComponents/Layout';

import '../styles/global.css';
import '../styles/theme.css';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forest',
  description: 'Forest',
  twitter: {
    title: 'NFT marketplace and comprehensive ecosystem gateway within aelf',
    description: 'NFT marketplace and comprehensive ecosystem gateway within aelf',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1730346357829-%E5%B8%B8%E8%A7%84%E5%9B%BE%20%281%29.png',
    },
  },
  openGraph: {
    title: 'NFT marketplace and comprehensive ecosystem gateway within aelf',
    description: 'NFT marketplace and comprehensive ecosystem gateway within aelf',
    type: 'website',
    images: {
      width: 1200,
      height: 630,
      url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1730346357829-%E5%B8%B8%E8%A7%84%E5%9B%BE%20%281%29.png',
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
