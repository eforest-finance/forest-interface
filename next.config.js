/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const { ANALYZE, NEXT_PUBLIC_APP_ENV } = process.env;
const pluginConfig = require('./build.config/plugin');
const development = require('./build.config/development');
const production = require('./build.config/production');

const baseConfig = ANALYZE === 'true' || NEXT_PUBLIC_APP_ENV === 'production' ? production : development;

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: false,
  devIndicators: {
    autoPrerender: true,
  },
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^electron$/,
      }),
    );
    config.optimization.minimize = true;
    config.optimization.minimizer.push(new TerserPlugin());

    config.ignoreWarnings = [{ module: /node_modules/ }];
    config.resolve.alias['antd5'] = path.resolve(__dirname, 'node_modules/@aelf-design/common/node_modules/antd');
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPlugins(pluginConfig, nextConfig);
