module.exports = (api) => {
  api.cache(false);

  return {
    extends: './themes/theme-gmd/babel.config.js',
  };
};
