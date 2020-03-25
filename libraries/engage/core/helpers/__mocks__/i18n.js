export const i18n = {
  ready: true,
  init: () => {},
  text: input => input || '',
  price: () => 'p',
  number: () => 'n',
  date: () => 'd',
  time: () => 't',
  getLang: () => 'de-DE',
};

/** @returns {string[]} */
export const getWeekDaysOrder = () => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
