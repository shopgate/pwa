import { connect } from 'react-redux';
import { getHistoryLocation } from '@shopgate/pwa-common/selectors/history';
import {
  getActiveTab,
  isTabBarVisible,
  isTabBarEnabled,
} from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeTab: getActiveTab(state),
  isVisible: isTabBarVisible(state),
  isEnabled: isTabBarEnabled(state),
  path: getHistoryLocation(state),
});

export default connect(mapStateToProps);

