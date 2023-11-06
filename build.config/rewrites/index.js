const devConfig = require('./development');
const dev4Config = require('./development4');
const proConfig = require('./production');
const testConfig = require('./test');
const { NEXT_PUBLIC_APP_ENV } = process.env;

const getConfig = () => {
  switch (NEXT_PUBLIC_APP_ENV) {
    case 'development':
      return devConfig;
    case 'development4':
      return dev4Config;
    case 'test':
      return testConfig;
    case 'production':
      return proConfig;
    default:
      return proConfig;
  }
};

module.exports = getConfig();
