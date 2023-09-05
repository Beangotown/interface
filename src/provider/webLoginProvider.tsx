'use client';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import { NetworkType, PortkeyProvider } from '@portkey/did-ui-react';
import { store } from 'redux/store';

export default ({ children }: { children: React.ReactNode }) => {
  return <PortkeyProvider networkType={'TESTNET'}>{children}</PortkeyProvider>;
};
