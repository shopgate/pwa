module.exports = (api) => {
  api.cache(true);

  return {
    extends: './themes/theme-ios11/babel.config.js',
  };
};
