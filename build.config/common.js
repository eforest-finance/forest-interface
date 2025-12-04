module.exports = {
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  images: {
    // loader: 'akamai',
    // path: '',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.feishu.cn',
      },
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: '**.schrodingernft.ai',
      },
      {
        protocol: 'https',
        hostname: '**.schrodingerai.com',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },
  // i18n: {
  //   locales: ['en-US', 'zh'],
  //   defaultLocale: 'en-US',
  // },
  productionBrowserSourceMaps: true,
  sentry: {
    hideSourceMaps: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
