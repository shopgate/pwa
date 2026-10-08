module.exports = (api) => {
  api.cache(true);

  return {
    extends: './themes/theme-ios11/babel.config.js',
    env: {
      production: {
        presets: [
          ['@babel/preset-env', {
            modules: false,
            bugfixes: true,
            useBuiltIns: false,
          }],
        ],
      },
    },
  };
};
