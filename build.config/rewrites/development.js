module.exports = [
  {
    source: '/connect/:path*',
    destination: 'http://192.168.67.241:8080/connect/:path*',
  },
  {
    source: '/portkey/:path*',
    destination: 'http://192.168.67.241:5577/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'http://192.168.67.234:8100/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'http://192.168.67.234:8100/:path*',
  },
  {
    source: '/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
    destination: 'http://192.168.67.234:8100/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
  },
];
