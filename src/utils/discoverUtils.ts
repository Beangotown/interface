import { LOGIN_EARGLY_KEY } from 'constants/platform';

const removeDiscoverStorageSign = () => {
  window.localStorage.removeItem(LOGIN_EARGLY_KEY);
};

export default { removeDiscoverStorageSign };
