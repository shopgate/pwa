import { connect } from 'react-redux';
import { makeGetMenu, makeGetIsFetchingMenu } from '@shopgate/engage/core';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getMenu = makeGetMenu(QUICKLINKS_MENU);
  const getIsFetchingMenu = makeGetIsFetchingMenu(QUICKLINKS_MENU);
  return state => ({
    links: getMenu(state),
    isFetching: getIsFetchingMenu(state),
  });
};

export default connect(makeMapStateToProps);
