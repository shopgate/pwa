/* eslint-disable camelcase */
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const TerserPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const ShopgateIndexerPlugin = require('./plugins/ShopgateIndexerPlugin');
const ShopgateThemeConfigValidatorPlugin = require('./plugins/ShopgateThemeConfigValidatorPlugin');
const { ENV, isDev, PUBLIC_FOLDER } = require('./lib/variables');
const getAppSettings = require('./lib/getAppSettings');
const convertLanguageToISO = require('./lib/convertLanguageToISO');
const getComponentsSettings = require('./lib/getComponentsSettings');
const getThemeConfig = require('./lib/getThemeConfig');
const getThemeLanguage = require('./lib/getThemeLanguage');
const getDevConfig = require('./lib/getDevConfig');
const i18n = require('./lib/i18n');
const getExtensionsNodeModulesPaths = require('./lib/getExtensionsNodeModulesPaths');

const themePath = process.cwd();
const appConfig = getAppSettings(themePath);
const themeConfig = getThemeConfig(themePath, appConfig);
const isoLang = convertLanguageToISO(appConfig.language);
const { sourceMap, ip, apiPort } = getDevConfig();
const t = i18n(__filename);

const config = {
  mode: ENV,
  entry: {
    app: [
      ...(!isDev ? [
        path.resolve(__dirname, 'lib', 'offline.js'),
      ] : []),
      path.resolve(__dirname, 'lib', 'polyfill.js'),
      path.resolve(themePath, 'index.jsx'),
    ],
    common: [
      'intl',
      `intl/locale-data/jsonp/${isoLang}`,
      'react',
      'react-dom',
      'glamor',
      'react-redux',
      'reselect',
    ],
  },
  output: {
    filename: !isDev ? '[name].[hash].js' : '[name].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(themePath, PUBLIC_FOLDER),
    publicPath: isDev ? '/' : (process.env.publicPath || './'),
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      ...rxPaths(),
      'react-dom': '@hot-loader/react-dom',
    },
    modules: [
      path.resolve(themePath, 'widgets'),
      path.resolve(themePath, 'node_modules'),
      path.resolve(themePath, '..', '..', 'node_modules'),
      path.resolve(themePath, '..', '..', 'extensions'),
      ...getExtensionsNodeModulesPaths(),
    ],
  },
  plugins: [
    new ShopgateThemeConfigValidatorPlugin(),
    new ShopgateIndexerPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV),
        APP_CONFIG: JSON.stringify(appConfig),
        COMPONENTS_CONFIG: JSON.stringify(getComponentsSettings(themePath)),
        THEME_CONFIG: JSON.stringify(themeConfig),
        THEME: JSON.stringify(process.env.theme),
        THEME_PATH: JSON.stringify(themePath),
        // @deprecated Replaced by LOCALE and LOCALE_FILE - kept for now for theme compatibility.
        LANG: JSON.stringify(isoLang),
        LOCALE: JSON.stringify(isoLang),
        LOCALE_FILE: JSON.stringify(getThemeLanguage(themePath, appConfig.language)),
        IP: JSON.stringify(ip),
        PORT: JSON.stringify(apiPort),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      debug: isDev,
      options: {
        context: themePath,
        output: {
          path: path.resolve(themePath, PUBLIC_FOLDER),
        },
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HTMLWebpackPlugin({
      title: appConfig.shopName || process.env.theme,
      filename: path.resolve(themePath, PUBLIC_FOLDER, 'index.html'),
      template: path.resolve(__dirname, 'templates', 'default.ejs'),
      appId: appConfig.appId,
      inject: false,
      cache: !isDev,
      minify: !isDev ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
      } : false,
    }),
    new ScriptExtHtmlWebpackPlugin({
      sync: ['app', 'common'],
      prefetch: /\.js$/,
      defaultAttribute: 'async',
    }),
    new ProgressBarWebpackPlugin({
      format: `  ${t('WEBPACK_PROGRESS', {
        bar: chalk.blue(':bar'),
        message: ':msg',
        percent: chalk.green(':percent'),
        elapsed: ':elapsed',
      })}`,
      clear: false,
    }),
    ...(!isDev ? [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        minRatio: 1,
      }),
      new GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: true,
      }),
    ] : []),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: new RegExp(`node_modules\\b(?!\\${path.sep}@shopgate)\\b.*`),
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(themePath, 'babel.config.js'),
              cacheDirectory: path.resolve(themePath, '..', '..', '.cache-loader'),
            },
          },
        ],
      },
    ],
  },
  devtool: isDev ? sourceMap : (process.env.SOURCE_MAPS || false),
  stats: isDev ? 'normal' : 'errors-only',
  performance: {
    hints: isDev ? false : 'warning',
  },
  watchOptions: {
    ignored: /node_modules\b(?!\/@shopgate)\b.*/,
  },
  devServer: {
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    publicPath: '/',
    contentBase: path.resolve(themePath, PUBLIC_FOLDER),
    host: process.env.optionsHost,
    port: process.env.optionsPort,
    historyApiFallback: true,
    stats: {
      colors: true,
    },
  },
  optimization: {
    usedExports: true,
    sideEffects: true,
    namedModules: true,
    namedChunks: true,
    nodeEnv: ENV,
    removeAvailableModules: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules/,
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        sourceMap: true,
        terserOptions: {
          ecma: 5,
          keep_fnames: false,
          mangle: true,
          safari10: false,
          toplevel: false,
          warnings: false,
          output: {
            comments: false,
          },
          parse: {
            shebang: false,
          },
          compress: {
            passes: 3,
            keep_fargs: false,
          },
        },
      }),
    ],
  },
};

module.exports = config;
/* eslint-enable camelcase */
