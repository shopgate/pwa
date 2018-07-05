import { connect } from 'react-redux';
import { getProductName } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  name: getProductName(state),
});

export default connect(mapStateToProps);
