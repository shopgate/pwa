import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, state) => dispatch(historyPush({
    pathname,
    state,
  })),
});

/**
 * @returns {boolean}
 */
const areStatePropsEqual = () => true;

export default connect(null, mapDispatchToProps, null, { areStatePropsEqual });
