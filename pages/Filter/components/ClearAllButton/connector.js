import { connect } from 'react-redux';
import removeAllTemporaryFilters from '@shopgate/pwa-common-commerce/filter/actions/removeAllTemporaryFilters';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  removeAllTemporaryFilters: () => dispatch(removeAllTemporaryFilters()),
});

export default connect(null, mapDispatchToProps);
