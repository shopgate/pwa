import { connect } from 'react-redux';
import getLiveshoppingProducts from '@shopgate/pwa-common-commerce/product/actions/getLiveshoppingProducts';
import { selectProductIds } from './selectors';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  products: selectProductIds(state, props),
});

const mapDispatchToProps = {
  fetchProducts: getLiveshoppingProducts,
};

export default connect(mapStateToProps, mapDispatchToProps);
