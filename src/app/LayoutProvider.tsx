'use client';

import dynamic from 'next/dynamic';
import Layout from 'pageComponents/layout';
import React from 'react';

const HOSTNAME_PREFIX_LIST = ['tg.', 'tg-test.', 'localhost'];
const TELEGRAM_SRC = 'https://telegram.org/js/telegram-web-app.js';

const LayoutProvider = dynamic(
  async () => {
    if (typeof window !== 'undefined') {
      if (typeof location !== 'undefined') {
        if (HOSTNAME_PREFIX_LIST.some((h) => location.hostname.includes(h))) {
          const script = document.createElement('script');
          script.src = TELEGRAM_SRC;

          const _p = new Promise<boolean>((resolve) => {
            script.addEventListener('load', () => {
              resolve(true);
            });

            script.addEventListener('error', () => {
              resolve(false);
            });
          });

          document.body.appendChild(script);
          await _p;
        }
      }
    }

    return (props: React.PropsWithChildren<{}>) => {
      const { children } = props;
      return <Layout>{children}</Layout>;
    };
  },
  { ssr: false },
);

export default LayoutProvider;
