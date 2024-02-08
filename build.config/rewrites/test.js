module.exports = [
  {
    source: '/connect/:path*',
    destination: 'https://auth-aa-portkey-test.portkey.finance/connect/:path*',
  },
  {
    source: '/portkey/:path*',
    destination: 'https://aa-portkey-test.portkey.finance/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'https://test.beangotown.com/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'https://testv2.beangotown.com/cms/:path*',
  },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'http://192.168.67.51:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
  },
  {
    source: '/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
    destination: 'https://test.beangotown.com/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
  },
];
