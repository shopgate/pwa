import { connect } from 'react-redux';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  navigate() {
    const query = parseObjectToQueryString(props.query);
    dispatch(navigate(ACTION_PUSH, `${CATEGORY_PATH}/${props.categoryId}/filter${query}`));
  },
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
