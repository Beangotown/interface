const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: true,
  // output: 'export',
  // async rewrites() {
  //   return rewritesConfig;
  // },
  images: {
    // loader: 'akamai',
    // path: '',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.com',
      },
    ],
  },
  // i18n: {
  //   locales: ['en-US', 'zh'],
  //   defaultLocale: 'en-US',
  // },
  productionBrowserSourceMaps: true,
  // sentry: {
  //   hideSourceMaps: true,
  // },
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.ignoreWarnings = [{ module: /node_modules/ }];
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
