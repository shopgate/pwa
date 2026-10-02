module.exports = (api) => {
  api.cache(true);

  return {
    extends: './themes/theme-gmd/babel.config.js',
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
