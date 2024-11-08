import 'styles/base.css';

import Script from 'next/script';

import 'antd/dist/antd.css';
import Provider from 'provider';

import 'styles/global.css';
import 'styles/theme.css';
import LayoutProvider from './LayoutProvider';

export const metadata = {
  title: 'BeanGoTown',
  description: 'BeanGoTown',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <Script strategy="afterInteractive" id="rem-px" />
        <Script strategy="afterInteractive" src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>
        <Provider>
          <LayoutProvider>{children}</LayoutProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
