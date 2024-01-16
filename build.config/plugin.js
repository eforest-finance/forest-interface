// const withLess = require('next-with-less');

const { withSentryConfig } = require('@sentry/nextjs');
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  include: '.next',
  configFile: '.sentryclirc',
  urlPrefix: '~/_next',
  org: 'blockchainforever',
  project: 'forest',
};
module.exports = [(nextConfig) => withSentryConfig(nextConfig, sentryWebpackPluginOptions)];
