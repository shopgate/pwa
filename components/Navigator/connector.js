import { connect } from 'react-redux';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';
import { isProgressBarShowing } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  backgroundColor: state.navigator.backgroundColor,
  filterOpen: state.navigator.filterOpen,
  navigatorEnabled: state.navigator.enabled,
  searchActive: state.navigator.searchActive,
  showSearch: state.navigator.showSearch,
  showTitle: state.navigator.showTitle,
  showLoadingBar: (isProgressBarShowing(state) && isCurrentViewLoading(state)),
  textColor: state.navigator.textColor,
});

export default connect(mapStateToProps, null, null, { withRef: true });
