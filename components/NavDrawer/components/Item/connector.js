import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (href, state) => dispatch(historyPush({
    pathname: href,
    state,
  })),
});

/**
 * @returns {boolean}
 */
const areStatePropsEqual = () => true;

export default connect(null, mapDispatchToProps, null, { areStatePropsEqual });
