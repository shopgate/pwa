import { connect } from 'react-redux';
import provideProduct from '@shopgate/pwa-common-commerce/product/action-creators/provideProduct';
import fetchFavorites from '@shopgate/pwa-common-commerce/favorites/actions/fetchFavorites';

/**
 * @param {Object} state .
 * @param {Object} props .
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  product: fetchFavorites(state, props),
});

const mapDispatchToProps = {
  provideProduct,
};

export default connect(mapStateToProps, mapDispatchToProps);
