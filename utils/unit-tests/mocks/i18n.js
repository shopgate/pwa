/**
 * Mock for @shopgate/engage/core/helpers/i18n.
 *
 * The published packages don't contain their __mocks__ folders, so consumers like extensions can't
 * rely on the manual mock of the package itself. Without it the translation helpers are not
 * initialized, so components which render a translated string don't work.
 */
const i18n = {
  ready: true,
  init: () => {},
  text: input => input || '',
  price: () => 'p',
  number: () => 'n',
  date: () => 'd',
  time: () => 't',
  getLang: () => 'de-DE',
  getPath: path => path,
  has: path => typeof path === 'string' && /^\S+\.\S+/.test(path),
};

module.exports = {
  __esModule: true,
  i18n,
  getWeekDaysOrder: () => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
};
