import { connect } from 'react-redux';
import provideProduct from '@shopgate/pwa-common-commerce/product/action-creators/provideProduct';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * @param {Object} state .
 * @param {Object} props .
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  product: getProduct(state, props),
});

const mapDispatchToProps = {
  provideProduct,
};

export default connect(mapStateToProps, mapDispatchToProps);
