module.exports = [
  {
    source: '/connect/:path*',
    destination: 'https://auth-aa-portkey.portkey.finance/connect/:path*',
  },
  {
    source: '/portkey/:path*',
    destination: 'https://aa-portkey.portkey.finance/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'https://www.beangotown.com/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'https://cms.beangotown.com/:path*',
  },
  {
    source: '/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
    destination: 'https://dapp.beangotown.com/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
  },
];
