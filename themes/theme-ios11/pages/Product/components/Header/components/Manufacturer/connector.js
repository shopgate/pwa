import { connect } from 'react-redux';
import { getProductManufacturer } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  manufacturer: getProductManufacturer(state),
});

export default connect(mapStateToProps);
