// import connect from '@shopgate/pwa-common/helpers/routedConnect';
import { connect } from 'react-redux';
import { getPageConfig } from '@shopgate/pwa-common/actions/page';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  configs: state.page,
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getPageConfig: (pageId) => {
    dispatch(getPageConfig(pageId));
  },
});

/**
 * Connects a component to the widget store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const homepage = Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component)
;

export default homepage;
