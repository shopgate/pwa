module.exports = (api) => {
  api.cache(true);

  return {
    compact: true,
    sourceType: 'unambiguous',
    presets: [
      ['@babel/preset-env', {
        modules: false,
      }],
      '@babel/preset-react',
      '@babel/preset-flow',
    ],
    plugins: [
      'lodash',
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-proposal-object-rest-spread', {
        loose: true,
      }],
      ['@babel/plugin-transform-spread', {
        loose: true,
      }],
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      'transform-export-extensions',
      ['@babel/plugin-syntax-dynamic-import', {
        loose: true,
      }],
      ['module-resolver', {
        cwd: 'packagejson',
        alias: {
          Components: './components',
          Config: './config',
          Extensions: './extensions',
          Pages: './pages',
        },
      }],
      ['@babel/plugin-transform-runtime', {
        helpers: false,
        regenerator: true,
      }],
      'flow-react-proptypes',
    ],
    env: {
      test: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-flow',
        ],
      },
      development: {
        plugins: [
          'react-hot-loader/babel',
        ],
      },
      production: {
        plugins: [
          'transform-react-remove-prop-types',
        ],
      },
    },
  };
};
