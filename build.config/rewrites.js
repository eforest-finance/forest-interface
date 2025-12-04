let rewrite = [];

if (process.env.NEXT_PUBLIC_APP_ENV === 'development3') {
  rewrite = [
    { source: '/api/:path*', destination: 'http://192.168.67.124:5588/api/:path*' },
    { source: '/cms/:path*', destination: 'http://192.168.67.124:8056/:path*' },
    { source: '/signalr-hubs/:path*', destination: 'http://192.168.67.124:5588/signalr-hubs/:path*' },
    { source: '/connect/:path*', destination: 'http://192.168.67.124:8080/connect/:path*' },
    { source: '/portkey/connect/:path*', destination: 'http://192.168.67.127:8080/connect/:path*' },
    {
      source: '/AElfIndexer_DApp/:path*',
      destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/:path*',
    },
    { source: '/portkey/v1/api/:path*', destination: 'http://192.168.66.203:5001/api/:path*' },
    { source: '/portkey/v2/api/:path*', destination: 'http://192.168.67.127:5001/api/:path*' },
  ];
}
if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
  rewrite = [
    { source: '/api/:path*', destination: 'http://192.168.66.131:5004/api/:path*' },
    { source: '/cms/:path*', destination: 'http://192.168.66.131:8055//:path*' },
    { source: '/connect/:path*', destination: 'http://192.168.66.131:8004/connect/:path*' },
    { source: '/signalr-hubs/:path*', destination: 'http://192.168.66.131:5004/signalr-hubs/:path*' },
    { source: '/portkey/connect/:path*', destination: 'http://192.168.67.179:8001/connect/:path*' },

    {
      source: '/AElfIndexer_DApp/:path*',
      destination: 'http://192.168.66.203:8083/AElfIndexer_DApp/:path*',
    },
    { source: '/portkey/api/:path*', destination: 'http://192.168.67.179:5001/api/:path*' },
  ];
}
if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
  rewrite = [
    {
      source: '/schrodingerai/api/probability/:path*',
      destination: 'https://schrodingerai.com/api/probability/:path*',
    },
    { source: '/signalr-hubs/:path*', destination: 'https://test.eforest.finance/signalr-hubs/:path*' },
    { source: '/api/:path*', destination: 'https://test.eforest.finance/api/:path*' },
    { source: '/cms/:path*', destination: 'https://test.eforest.finance/cms/:path*' },
    { source: '/connect/:path*', destination: 'https://test.eforest.finance/connect/:path*' },
    {
      source: '/AElfIndexer_DApp/PortKeyIndexerCASchema/:path*',
      destination: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/:path*',
    },
    { source: '/portkey/api/:path*', destination: 'https://did-portkey-test.portkey.finance/api/:path*' },
  ];
}

module.exports = rewrite;
