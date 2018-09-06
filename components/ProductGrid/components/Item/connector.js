import { connect } from 'react-redux';
import { isRelativeProductOnList } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} product Given product.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, { product }) => ({
  isFavorite: isRelativeProductOnList(state, { productId: product.id }),
});

export default connect(mapStateToProps);
