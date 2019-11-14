import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  historyPush: (params) => {
    dispatch(historyPush({
      ...params,
      state: {
        preventA11yFocus: true,
      },
    }));
  },
});

export default connect(null, mapDispatchToProps);

