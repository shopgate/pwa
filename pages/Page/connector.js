import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import getPageConfig from '@shopgate/pwa-common/actions/page/getPageConfig';

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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
