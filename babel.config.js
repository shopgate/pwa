module.exports = (api) => {
  api.cache(true);

  return {
    extends: './themes/theme-gmd/babel.config.js',
  };
};
