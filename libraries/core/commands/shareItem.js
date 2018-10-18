import AppCommand from '../classes/AppCommand';

/**
 * Sends a shareItem command to the app.
 * @param {Object} params The command paramters.
 * @param {string} params.title The product title
 * @param {string} params.imageURL The products image url to be loaded
 * @param {string} params.deepLink The products deep link
 */
export default (params) => {
  const merged = {
    title: '',
    imageURL: '',
    deepLink: '',
    ...params,
  };

  if (merged.deepLink) {
    merged.deepLink = merged.deepLink.replace(/(\?|&)shopgate_redirect=1/i, '');
  }
  const command = new AppCommand();

  command
    .setCommandName('shareItem')
    .dispatch(merged);
};
