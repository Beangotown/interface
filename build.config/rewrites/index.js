const devConfig = require('./development');
const dev4Config = require('./development4');
const proConfig = require('./production');
const testConfig = require('./test');
const { NEXT_PUBLIC_APP_ENV } = process.env;

const getConfig = (env) => {
  switch (env) {
    case 'production':
      return proConfig;
    case 'test':
      return testConfig;
    case 'development':
      return devConfig;
    case 'development4':
      return dev4Config;
    default:
      return proConfig;
  }
};

module.exports = getConfig(NEXT_PUBLIC_APP_ENV);
