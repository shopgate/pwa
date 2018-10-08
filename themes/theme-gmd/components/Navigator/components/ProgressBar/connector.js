import { connect } from 'react-redux';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  loading: isViewLoading(state),
});

export default connect(mapStateToProps);
