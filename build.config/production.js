const commonConfig = require('./common');

module.exports = {
  ...commonConfig,
  swcMinify: true,
  compiler: {
    emotion: true,
    removeConsole: {
      exclude: ['error', 'info'],
    },
  },
  experimental: {
    'react-use': {
      transform: 'react-use/lib/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  resolve: {},
};
