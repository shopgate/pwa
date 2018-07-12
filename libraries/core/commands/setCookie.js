import AppCommand from '../classes/AppCommand';

/**
 * Sends an setCookie command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.name The name of the cookie.
 * @param {string} params.value The value of the cookie.
 * @param {string} params.domain The domain for the cookie.
 * @param {number} params.expires The expiration datetime.
 * @param {string} params.path The path for the cookie.
 * @param {boolean} params.secure
 * @param {boolean} params.httpOnly
 */
export default (params) => {
  const command = new AppCommand();

  command
    .setCommandName('setCookie')
    .dispatch(params);
};
