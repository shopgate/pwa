/* eslint-disable camelcase */
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const TerserPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
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
const { resolveForAliasPackage } = require('./lib/helpers');
const getExtensionsNodeModulesPaths = require('./lib/getExtensionsNodeModulesPaths');

const themePath = process.cwd();
const appConfig = getAppSettings(themePath);
const themeConfig = getThemeConfig(themePath, appConfig);
const isoLang = convertLanguageToISO(appConfig.language);
const { sourceMap, ip, apiPort } = getDevConfig();
const themeLanguage = getThemeLanguage(themePath, appConfig.language);
const t = i18n(__filename);

const devtool = isDev ? sourceMap : (process.env.SOURCE_MAPS || false);
const fileSuffix = devtool ? '.sm' : '';
const addBundleAnalyzer = !!process.env.BUNDLE_ANALYZER;

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: ENV,
  entry: {
    app: {
      import: [
        ...(!isDev ? [
          path.resolve(__dirname, 'lib', 'offline.js'),
        ] : []),
        path.resolve(__dirname, 'lib', 'polyfill.js'),
        path.resolve(themePath, 'index.jsx'),
      ],
      dependOn: 'vendor',
    },
    vendor: [
      'glamor',
      'intl',
      `intl/locale-data/jsonp/${isoLang}`,
      'react',
      'react-dom',
      'react-redux',
      'reselect',
    ],
  },
  output: {
    filename: !isDev ? `[name].[contenthash]${fileSuffix}.js` : `[name]${fileSuffix}.js`,
    chunkFilename: `[name].[chunkhash]${fileSuffix}.js`,
    path: path.resolve(themePath, PUBLIC_FOLDER),
    publicPath: isDev ? '/' : (process.env.publicPath || './'),
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.mjs'],
    /**
     * Aliases for module resolution. They guarantee that whenever one of the bundled modules
     * uses in import to one of the packages, it will always resolve to the version of the core.
     */
    alias: {
      ...rxPaths(),

      // Packages from common module
      react: resolveForAliasPackage('react'),
      'react-dom': resolveForAliasPackage('react-dom'),
      'react-redux': resolveForAliasPackage('react-redux'),
      reselect: resolveForAliasPackage('reselect'),
      glamor: resolveForAliasPackage('glamor'),
      intl: resolveForAliasPackage('intl'),
      'intl/locale-data/jsonp': resolveForAliasPackage('intl', '/locale-data/jsonp'),

      // Additional packages that are sometimes used in devDependencies of extensions
      'react-helmet': resolveForAliasPackage('react-helmet'),
      'css-spring': resolveForAliasPackage('css-spring'),
      'react-transition-group': resolveForAliasPackage('react-transition-group'),
      '@virtuous': resolveForAliasPackage('@virtuous'),
      lodash: resolveForAliasPackage('lodash'),
      'prop-types': resolveForAliasPackage('prop-types'),

      // Internal Shopgate packages
      '@shopgate/engage': resolveForAliasPackage('@shopgate/engage'),
      '@shopgate/pwa-common': resolveForAliasPackage('@shopgate/pwa-common'),
      '@shopgate/pwa-common-commerce': resolveForAliasPackage('@shopgate/pwa-common-commerce'),
      '@shopgate/pwa-core': resolveForAliasPackage('@shopgate/pwa-core'),
      '@shopgate/pwa-tracking': resolveForAliasPackage('@shopgate/pwa-tracking'),
      '@shopgate/pwa-ui-ios': resolveForAliasPackage('@shopgate/pwa-ui-ios'),
      '@shopgate/pwa-ui-material': resolveForAliasPackage('@shopgate/pwa-ui-material'),
      '@shopgate/pwa-ui-shared': resolveForAliasPackage('@shopgate/pwa-ui-shared'),
      '@shopgate/pwa-webcheckout-shopify': resolveForAliasPackage('@shopgate/pwa-webcheckout-shopify'),
      '@shopgate/tracking-core': resolveForAliasPackage('@shopgate/tracking-core'),
    },
    modules: [
      'node_modules',
      path.resolve(themePath, 'widgets'),
      path.resolve(themePath, 'node_modules'),
      path.resolve(themePath, '..', '..', 'node_modules'),
      path.resolve(themePath, '..', '..', 'extensions'),
      ...getExtensionsNodeModulesPaths(),
    ],
  },
  plugins: [
    new ShopgateThemeConfigValidatorPlugin(),

    // Create mapping files inside the theme extensions folder the enable access to code that's
    // provided by extensions via extension-config.json
    new ShopgateIndexerPlugin(),

    // Inject environment variables so that they are available within the bundled code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV),
        APP_CONFIG: JSON.stringify(appConfig),
        COMPONENTS_CONFIG: JSON.stringify(getComponentsSettings(themePath)),
        THEME_CONFIG: JSON.stringify(themeConfig),
        THEME: JSON.stringify(process.env.theme),
        THEME_PATH: JSON.stringify(themePath),
        LOCALE: JSON.stringify(isoLang),
        LOCALE_FILE: JSON.stringify(themeLanguage),
        LOCALE_FILE_LOWER_CASE: JSON.stringify(themeLanguage.toLowerCase()),
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

    // Plugin to minify the HTML output fo the default.ejs template
    new HTMLWebpackPlugin({
      title: appConfig.shopName || process.env.theme,
      filename: path.resolve(themePath, PUBLIC_FOLDER, 'index.html'),
      template: path.resolve(__dirname, 'templates', 'default.ejs'),
      webBridge: process.env.WEB_BRIDGE && 'https://sandbox.cdn.connect.shopgate.com/deviceBridge.js',
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

    // Progress bar that shows build progress in the console
    new ProgressBarWebpackPlugin({
      format: `  ${t('WEBPACK_PROGRESS', {
        bar: chalk.blue(':bar'),
        message: ':msg',
        percent: chalk.green(':percent'),
        elapsed: ':elapsed',
      })}`,
      clear: false,
    }),

    // Bundle analyzer plugin to visualize size of webpack output files
    ...(isDev && addBundleAnalyzer ? [
      new BundleAnalyzerPlugin(),
    ] : []),
    ...(isDev ? [new ReactRefreshWebpackPlugin()] : []),
    ...(!isDev ? [
      new CompressionWebpackPlugin({
        filename: '[path][base].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        minRatio: 1,
      }),
      new GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: true,
      }),
      // Extract CSS into separate minified files on production builds
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].css',
      }),
      new CssMinimizerPlugin(),
    ] : []),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name].[contenthash][ext][query]',
        },
      },
      {
        test: /\.css$/,
        // Bundle CSS on development, extract it into separate files on production
        use: isDev ? [
          'style-loader',
          'css-loader',
        ] : [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
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
              plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /@babel\/runtime[\\/]+helpers[\\/]esm/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devtool,
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
    devMiddleware: {
      publicPath: '/',
      stats: {
        colors: true,
      },
    },
    allowedHosts: 'all',
    static: {
      directory: path.resolve(themePath, PUBLIC_FOLDER),
    },
    client: {
      // Deactivate full-screen error overlay in dev server
      overlay: false,
    },
    host: '0.0.0.0',
    port: process.env.optionsPort,
    historyApiFallback: true,
    proxy: process.env.WEB_BRIDGE ? {
      '/api': {
        target: `http://${ip}:${apiPort}`,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        debug: true,
        secure: false,
        cookieDomainRewrite: {
          '*': '',
        },
      },
    } : undefined,
  },
  optimization: {
    emitOnErrors: false,
    usedExports: true,
    sideEffects: true,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    nodeEnv: ENV,
    removeAvailableModules: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ecma: 5,
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
