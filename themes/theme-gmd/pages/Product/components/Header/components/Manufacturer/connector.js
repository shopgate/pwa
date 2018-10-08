import { connect } from 'react-redux';
import { getProductManufacturer } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  manufacturer: getProductManufacturer(state, props),
});

export default connect(mapStateToProps);
