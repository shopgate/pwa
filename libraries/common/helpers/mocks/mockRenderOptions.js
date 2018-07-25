import PropTypes from 'prop-types';

const options = {
  context: {
    i18n: () => ({
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
    history: {
      length: 0,
      stack: [],
      getActive: () => ({
        key: 'routekey',
      }),
    },
  },
  childContextTypes: {
    i18n: PropTypes.func,
    history: PropTypes.shape(),
  },
};

export default options;
