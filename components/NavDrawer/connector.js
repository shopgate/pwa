import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
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

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, title) => () => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
