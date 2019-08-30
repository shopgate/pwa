module.exports = (api) => {
  api.cache(api.env('test'));

  return {
    extends: './themes/theme-gmd/babel.config.js',
  };
};
