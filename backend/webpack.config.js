/* eslint-disable */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const child_process = require('child_process');

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: 'utf8' }).trim();
}

module.exports = {
  entry: ['./src/main.ts'],
  watch: false,
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    new webpack.EnvironmentPlugin({
      // GIT_TAG: git('describe --abbrev=0 --tags --always'),
      // GIT_COMMIT: git('describe --always'),
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: '../definitions/protocol-buffers',
          to: 'definitions/protocol-buffers',
        },
        {
          from: 'package.json',
          to: 'package.json',
        },
      ]
    }),
  ],
  resolve: {
    plugins: [new tsConfigPathsPlugin({ configFile: './tsconfig.build.json' })],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: ['/node_modules/'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  mode: 'none',
  output: {
    path: path.join(__dirname, 'bundle'),
    filename: 'server.js',
  },
};
