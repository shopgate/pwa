import { connect } from 'react-redux';
import {
  fetchLiveshoppingProducts,
} from '@shopgate/engage/product';
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
  fetchProducts: fetchLiveshoppingProducts,
};

export default connect(mapStateToProps, mapDispatchToProps);
