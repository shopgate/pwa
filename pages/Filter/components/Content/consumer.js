import { consume } from 'redux-props';
import { getFiltersByHash } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapProps = ({ state, props }) => ({
  filters: getFiltersByHash(state, props),
});

export default consume({ mapProps });
