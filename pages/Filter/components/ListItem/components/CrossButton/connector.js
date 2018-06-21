import { connect } from 'react-redux';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  removeTemporaryFilter: () => dispatch(removeTemporaryFilter(props.filterId)),
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
