import { connect } from 'react-redux';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  navigate() {
    dispatch(navigate(ACTION_PUSH, `${FILTER_PATH}${parseObjectToQueryString(props.query)}`));
  },
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
