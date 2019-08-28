module.exports = (api) => {
  api.cache(api.env('test'));

  return {
    compact: true,
    extends: './themes/theme-gmd/babel.config.js',
  };
};
