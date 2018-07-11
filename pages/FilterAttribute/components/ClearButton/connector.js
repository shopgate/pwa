import { connect } from 'react-redux';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  removeTemporaryFilter: (id, index) => dispatch(removeTemporaryFilter(id, index)),
});

export default connect(null, mapDispatchToProps);
