/** @typedef {import('@babel/core').ConfigAPI} ConfigAPI */
/** @typedef {import('@babel/core').TransformOptions} TransformOptions */

/**
 * @param {ConfigAPI} api The Babel config API object
 * @returns {TransformOptions}
 */
module.exports = (api) => {
  const isTest = api.env('test');
  const isProd = api.env('production');

  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        bugfixes: true,
        targets: {
          ios: '13.4',
          chrome: '80',
        },
        useBuiltIns: 'usage',
        corejs: 3,
      }],
      ['@babel/preset-react', {
        runtime: 'classic',
        development: !isProd && !isTest,
      }],
    ],

    plugins: [
      'lodash',
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
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
        helpers: true,
        regenerator: true,
      }],
    ],

    env: {
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'classic' }],
        ],
      },
      development: {
        plugins: [

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
