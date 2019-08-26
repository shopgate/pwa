module.exports = (api) => {
  api.cache(false);

  return {
    compact: true,
    babelrcRoots: [
      // Keep the root as a root
      '.',
      // Also consider monorepo packages "root" and load their .babelrc files.
      './themes/*',
    ],
    presets: [
      ['@babel/preset-env', {
        modules: false,
      }],
      '@babel/preset-react',
    ],
    plugins: [
      'babel-plugin-lodash',
      '@babel/plugin-proposal-class-properties',
      [
        '@babel/plugin-proposal-object-rest-spread',
        {
          loose: true,
          legacy: true,
        },
      ],
      [
        '@babel/plugin-transform-spread',
        {
          loose: true,
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      'transform-export-extensions',
      [
        '@babel/plugin-syntax-dynamic-import',
        {
          loose: true,
          legacy: true,
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          regenerator: true,
        },
      ],
    ],
    env: {
      test: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
        ],
      },
      development: {
        plugins: [
          'react-hot-loader/babel',
        ],
      },
      production: {
        plugins: [
          'babel-plugin-transform-react-remove-prop-types',
        ],
      },
    },
  };
};
