import { scheme } from '@portkey/utils';
import isMobile from './isMobile';

const jumpAppInH5 = () => {
  const maxWaitingTime = 3000;
  window.location.href = scheme.formatScheme({
    action: 'linkDapp',
    domain: window.location.host,
    custom: {
      url: window.location.href,
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden || document?.webkitHidden) {
      clearTimeout(openAppStore);
    }
  });

  const openAppStore = setTimeout(() => {
    if (isMobile().apple.device) {
      window.location.href = 'https://apps.apple.com/us/app/id6473827308';
    } else if (isMobile().android.device) {
      window.open('https://play.google.com/store/apps/details?id=com.portkey.finance', '_blank');
    } else {
      window.open('https://portkey.finance', '_blank');
    }
  }, maxWaitingTime);
};

export default jumpAppInH5;
