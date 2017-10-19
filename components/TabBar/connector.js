import { connect } from 'react-redux';
import {
  getActiveTab,
  isTabBarVisible,
  getVisibleTabs,
} from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  activeTab: getActiveTab(state),
  isVisible: isTabBarVisible(state),
  visibleTabs: getVisibleTabs(),
});

export default Component => (
  connect(mapStateToProps)(Component)
);

