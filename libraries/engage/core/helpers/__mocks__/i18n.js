export const i18n = {
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

/** @returns {string[]} */
export const getWeekDaysOrder = () => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
