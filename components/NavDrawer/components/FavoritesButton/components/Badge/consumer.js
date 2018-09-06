import { consume } from 'redux-props';
import { hasFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * @returns {Object}
 */
const mapProps = ({ state }) => ({
  visible: hasFavorites(state),
});

export default consume({ mapProps });
