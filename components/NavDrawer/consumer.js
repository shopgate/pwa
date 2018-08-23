import { consume } from 'redux-props';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * @returns {Object}
 */
const mapProps = ({ dispatch }) => ({
  navigate: (pathname, title) => () => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

/**
 * @returns {boolean}
 */
const stateChanged = () => false;

export default consume({
  mapProps,
  stateChanged,
});
