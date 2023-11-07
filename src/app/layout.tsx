import 'styles/base.css';

import Script from 'next/script';

import 'antd/dist/antd.css';
import Provider from 'provider';

import Layout from 'pageComponents/layout';

import 'styles/global.css';
import 'styles/theme.css';

export const metadata = {
  title: 'BeanGoTown',
  description: 'BeanGoTown',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <Script strategy="afterInteractive" id="rem-px">{`
        (function () {
            function initFontSize(doc, win) {
                var docEle = doc.documentElement;
                var event = 'onorientationchange' in window ? 'orientationchange' : 'resize';
                var fn = function () {
                  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                  var width = docEle.clientWidth;
                  var unitWidth = isMobile ? 390 : 1920;
                  if(width){
                    if(isMobile && (width > 580)) {
                      docEle.style.fontSize = '16px'
                    } else if (!isMobile && (width < 1200)) {
                      docEle.style.fontSize = '10px'
                    } else {
                      docEle.style.fontSize = 16 * (width / unitWidth) + 'px'
                    }
                  }
                };
                fn();
                win.addEventListener(event, fn, false);
                doc.addEventListener('DOMContentLoaded', fn, false);
            }

            if (window && document) {
              initFontSize(document, window);
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
