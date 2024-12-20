module.exports = [
  {
    source: '/connect/:path*',
    destination: 'http://192.168.66.203:8001/connect/:path*',
  },
  {
    source: '/portkey/:path*',
    destination: 'http://192.168.67.179:5003/:path*',
    // destination: 'https://localtest-applesign2.portkey.finance/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'http://192.168.66.248:5008/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'http://192.168.67.39:3108/:path*',
  },
  {
    source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
    destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
  },
  {
    source: '/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
    destination: 'http://192.168.67.39:5008/AElfIndexer_BeangoTown/BeangoTownIndexerPluginSchema/:path*',
  },
];
