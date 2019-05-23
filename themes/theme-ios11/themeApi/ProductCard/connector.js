import { connect } from 'react-redux';
import { getProductDataById } from '@shopgate/engage/product';

/**
 * @param {Function} state The Redux state.
 * @param {Function} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProductDataById(state, props),
});

export default connect(mapStateToProps);
