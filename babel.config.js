module.exports = (api) => {
  api.cache(false);

  return {
    compact: true,
    extends: './themes/theme-gmd/babel.config.js',
  };
};
