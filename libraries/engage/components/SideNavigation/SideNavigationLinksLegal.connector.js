import { connect } from 'react-redux';
import { makeGetMenu, makeGetIsFetchingMenu } from '@shopgate/engage/core';
import { LEGAL_MENU } from '@shopgate/pwa-common/constants/MenuIDs';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getMenu = makeGetMenu(LEGAL_MENU);
  const getIsFetchingMenu = makeGetIsFetchingMenu(LEGAL_MENU);
  return state => ({
    links: getMenu(state),
    isFetching: getIsFetchingMenu(state),
  });
};

export default connect(makeMapStateToProps);
