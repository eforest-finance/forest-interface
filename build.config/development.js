const commonConfig = require('./common');
const rewrites = require('./rewrites');

module.exports = {
  ...commonConfig,
  // do something
  async rewrites() {
    return rewrites;
  },
  swcJs: {
    esbuild: {
      minify: 'terser',
    },
  },
};
