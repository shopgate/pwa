import { connect } from 'react-redux';
import { hasProductVariants, isProductOrderable, getProductAvailability } from '@shopgate/engage/product';

/**
 * @param {Object} state .
 * @param {Object} props .
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  isOrderable: isProductOrderable(state, props) || hasProductVariants(state, props),
  availability: getProductAvailability(state, props),
});

export default connect(mapStateToProps);
