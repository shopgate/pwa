import { connect } from 'react-redux';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  removeAllTemporaryFilters: () => dispatch(removeTemporaryFilter(null)),
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
