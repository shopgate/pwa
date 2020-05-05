import { connect } from 'react-redux';
import { makeGetMenu } from '@shopgate/engage/core';
import { LEGAL_MENU } from '@shopgate/pwa-common/constants/MenuIDs';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getMenu = makeGetMenu(LEGAL_MENU);
  return state => ({
    legalPages: getMenu(state),
  });
};

export default connect(makeMapStateToProps);
