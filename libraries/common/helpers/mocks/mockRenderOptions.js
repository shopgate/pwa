import PropTypes from 'prop-types';

const options = {
  context: {
    i18n: () => ({
      // eslint-disable-next-line no-underscore-dangle
      __(input) {
        if (input) {
          return input;
        }
        return '';
      },
      _p: () => 'p',
      _d: () => 'd',
      _n: () => 'n',
    }),
  },
  childContextTypes: {
    i18n: PropTypes.func,
  },
};

export default options;
