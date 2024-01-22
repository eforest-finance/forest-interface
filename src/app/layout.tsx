import '../styles/base.css';

import Script from 'next/script';
import 'aelf-design/css';
import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import Provider from '../providers/provider';

import Layout from 'pagesComponents/Layout';

import '../styles/global.css';
import '../styles/theme.css';

export const metadata = {
  title: 'Forest',
  description: 'Forest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
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
      <head>
        <Script strategy="afterInteractive" id="rem-px">{`
        (function () {
            if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
              document.body.appendChild(script);
              script.onload = () => {
                setTimeout(() => {
                  new window.VConsole();
                }, 0);
              };
            }
        })();
      `}</Script>
      </head>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
