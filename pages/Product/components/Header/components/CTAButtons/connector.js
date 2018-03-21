import { connect } from 'react-redux';
import { getCurrentProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isCurrentProductOnFavoriteList } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isFavorite: isCurrentProductOnFavoriteList(state),
  productId: getCurrentProductId(state),
});

export default connect(mapStateToProps);
