import { connect } from 'react-redux';
import { getVariantAvailabilityByCharacteristics } from '@shopgate/pwa-common-commerce/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  availability: getVariantAvailabilityByCharacteristics(state, props),
});

export default connect(mapStateToProps);
