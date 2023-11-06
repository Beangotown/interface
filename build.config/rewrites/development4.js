module.exports = [
  {
    source: '/connect/:path*',
    destination: 'http://192.168.67.179:8001/connect/:path*',
  },
  {
    source: '/portkey/:path*',
    destination: 'http://192.168.67.179:5001/api/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'http://192.168.67.39:5008/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'http://192.168.67.39:3108/:path*',
  },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'http://192.168.67.67:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
  },
  {
    source: '/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
    destination: 'http://192.168.67.39:8095/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
  },
];
