import { connect } from 'react-redux';
import { getProductById } from '@shopgate/engage/product';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProductById(state, props),
});

export default connect(mapStateToProps);
