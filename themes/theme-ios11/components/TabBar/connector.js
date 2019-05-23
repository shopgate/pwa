import { connect } from 'react-redux';
import { getHistoryLocation } from '@shopgate/engage/core';
import {
  getActiveTab,
  isTabBarVisible,
} from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeTab: getActiveTab(state),
  isVisible: isTabBarVisible(state),
  path: getHistoryLocation(state),
});

export default connect(mapStateToProps);

