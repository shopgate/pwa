import { connect } from 'react-redux';
import { getFiltersByHash } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  filters: getFiltersByHash(state, props),
});

export default connect(mapStateToProps);
