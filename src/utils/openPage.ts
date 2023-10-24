import { scheme } from '@portkey/utils';
import { isMobileDevices } from './isMobile';
import isPortkeyApp from './inPortkeyApp';

export default function openPage(url: string) {
  if (isMobileDevices() && isPortkeyApp()) {
    try {
      const href = scheme.formatScheme({
        action: 'linkDapp',
        domain: window.location.host,
        custom: {
          url,
        },
      });
      window.open(href, '_blank');
    } catch (error) {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
}
