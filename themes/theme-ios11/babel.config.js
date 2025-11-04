module.exports = (api) => {
  const isTest = api.env('test');
  const isProd = api.env('production');

  api.cache(true);

  return {
    // Keep ES modules for Webpack tree-shaking

    presets: [
      ['@babel/preset-env', {
        modules: false,
        bugfixes: true,
        // If you need automatic polyfills for legacy browsers, uncomment:
        // useBuiltIns: 'usage',
        // corejs: 3,
      }],
      ['@babel/preset-react', {
        // React 16 -> classic runtime (keep this). If you move to React 17+,
        // switch to runtime: 'automatic'
        runtime: 'classic',
        development: !isProd && !isTest,
      }],

      '@babel/preset-flow',
    ],

    plugins: [
      // Keep lodash optimization
      'lodash',

      // Class fields (replace deprecated "proposal" plugin)
      ['@babel/plugin-transform-class-properties', { loose: true }],

      // If you use private fields/methods with loose semantics, add:
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],

      // Path aliases

      ['module-resolver', {
        cwd: 'packagejson',
        alias: {
          Components: './components',
          Config: './config',
          Extensions: './extensions',
          Pages: './pages',
        },
      }],

      // Runtime helpers (avoid inlining helpers everywhere)
      ['@babel/plugin-transform-runtime', {
        helpers: true,
        regenerator: true,
        // Do not set corejs here unless you want runtime to polyfill globals.
        // Prefer preset-env's useBuiltIns/corejs instead.
      }],
    ],

    env: {
      test: {
        // Transpile everything for Node/Jest
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'classic' }],
          '@babel/preset-flow',
        ],
      },
      development: {
        plugins: [
          // Flow to PropTypes is optional; keep if you still want it
          'flow-react-proptypes',
        ],
      },
      production: {
        plugins: [
          // Strip PropTypes in prod bundles
          'transform-react-remove-prop-types',
        ],
      },
    },
  };
};
