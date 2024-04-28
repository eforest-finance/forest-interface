import '../styles/base.css';

import Script from 'next/script';

import 'antd/dist/antd.css';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import Provider from '../providers/provider';

import Layout from 'pagesComponents/Layout';

import '../styles/global.css';
import '../styles/theme.css';

export const metadata = {
  title: 'Forest',
  description: 'Forest',
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
