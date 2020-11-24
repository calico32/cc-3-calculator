import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs';
import HTMLPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import OptimzeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';
import ScriptExtHTMLPlugin from 'script-ext-html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration, NormalModuleReplacementPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Configuration as WDSConfiguration } from 'webpack-dev-server';

dotenv.config();

const devMode = process.env.NODE_ENV === 'development';

// react refresh is broken in webpack v5 for now
// https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/252
const hotReload = true;

const resolve = (...dirs: string[]) => path.resolve(__dirname, ...dirs);

const statsConfig = (): Configuration['stats'] =>
  devMode
    ? {
        all: false,
        assets: true,
        cached: true,
        colors: true,
        hash: true,
        builtAt: true,
        timings: true,
        errors: true,
        errorDetails: true,
        logging: 'info',
        warnings: true,
        version: true,
        context: resolve('src'),
      }
    : { preset: 'normal' };

// not used in an SPA, uncomment for traditional multi-page app
// also uncomment anything labeled "non-SPA"
// const entrypoints: {
//   chunk: string;
//   entry: string;
//   output: string;
//   title?: string;
//   publicPath?: RegExp;
// }[] = [
//   {
//     chunk: 'main',
//     entry: resolve('src/index.tsx'),
//     output: 'index.html',
//     title: 'hello world',
//     publicPath: /^\/$/g,
//   },
// ];

export default <Configuration>{
  mode: devMode ? 'development' : 'production',
  // SPA
  entry: './src/index.tsx',
  // non-SPA
  // entry: entrypoints.reduce(
  //   (obj, item) => ((obj[item.chunk] = resolve(item.entry)), obj),
  //   {} as Record<string, string>
  // ),
  output: {
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: devMode ? '[name].js' : '[name].[contenthash].js',
    path: resolve('dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      querystring: require.resolve('querystring-es3'),
    },
    alias: !devMode
      ? {
          react: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
        }
      : {},
  },
  experiments: {
    topLevelAwait: true,
  },
  target: 'web',
  stats: statsConfig(),
  devtool: devMode ? 'eval-cheap-module-source-map' : 'source-map',
  devServer: {
    historyApiFallback: {
      // SPA
      rewrites: [
        {
          from: /[a-z0-9\-_]+\.(js|css|jpe?g|png|gif|mp3|ttf|eot|woff2?|md)$/i,
          to: context => '/' + context.match[0],
        },
        { from: /^.*$/, to: '/' },
      ],
      // non-SPA
      // rewrites: entrypoints.map(item => ({
      //   from: item.publicPath ?? new RegExp(`^/${item.chunk}$`),
      //   to: '/' + item.output,
      // })),
    },
    hot: hotReload,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    public: `http://localhost:${process.env.PORT}`,
    contentBase: [resolve('public')],
    stats: statsConfig(),
  } as WDSConfiguration,
  plugins: [
    new RemovePlugin({
      before: {
        exclude: ['dist/tsconfig.tsbuildinfo'],
        include: fs.readdirSync('dist').map(file => `dist/${file}`),
        logDebug: false,
        log: false,
        logWarning: false,
        logError: true,
      },
      watch: { beforeForFirstBuild: true },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: devMode ? 'server' : 'static',
      openAnalyzer: false,
    }),
    new ForkTSCheckerPlugin({
      eslint: {
        enabled: true,
        files: resolve('src/**/*.{ts,tsx,js,jsx}'),
      },
      logger: {
        devServer: devMode,
        infrastructure: 'silent',
        issues: 'console',
      },
    }),
    new NormalModuleReplacementPlugin(
      /.*\/feather-icons\/dist\/feather\.js/,
      path.resolve(__dirname, 'src/feather.js')
    ),

    new ScriptExtHTMLPlugin({ defaultAttribute: 'defer' }),
    // SPA
    new HTMLPlugin({
      template: resolve('src/template.ejs'),
      filename: 'index.html',
      minify: 'auto',
      title: 'web calculator',
      inject: false,
      chunks: ['main'],
    }),
    // non-SPA
    // ...entrypoints.map(
    //   item =>
    //     new HTMLPlugin({
    //       template: resolve('src/template.ejs'),
    //       filename: item.output,
    //       chunks: [item.chunk],
    //       title: item.title,
    //     })
    // ),
    devMode && hotReload && new ReactRefreshPlugin(),
    !devMode &&
      new MiniCSSExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
      }),
    !devMode && new OptimzeCSSAssetsPlugin(),
  ].filter(v => !!v),
  optimization: devMode
    ? {
        minimize: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: { chunks: 'async' },
      }
    : {
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        minimizer: [
          new TerserPlugin({
            test: /\.[jt]sx?$/i,
            extractComments: true,
          }),
        ],
        splitChunks: { chunks: 'all' },
      },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|mp3|ttf|eot|woff2?|md)$/i,
        loader: 'file-loader',
        options: { name: devMode ? '[name].[ext]' : '[contenthash].[ext]' },
      },
      { test: /\.jsx?$/i, enforce: 'pre', loader: 'source-map-loader' },
      {
        test: /\.tsx?$/i,
        use: [
          devMode &&
            hotReload && {
              loader: 'babel-loader',
              options: { plugins: ['@babel/plugin-syntax-top-level-await', 'react-refresh/babel'] },
            },
          { loader: 'ts-loader', options: { transpileOnly: true } },
        ].filter(v => !!v),
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: { plugins: [require('tailwindcss'), autoprefixer()] },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, implementation: require('sass') },
          },
        ],
      },
    ],
  },
};
