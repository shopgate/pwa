import { consume } from 'redux-props';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import { makeGetMenuById } from '../../selectors';

const getMenuById = makeGetMenuById();
const props = {
  id: QUICKLINKS_MENU,
};

/**
 * @returns {Object}
 */
const mapProps = ({ dispatch, state }) => ({
  links: getMenuById(state, props),
  navigate: (pathname, title) => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

/**
 * @param {Object} param.prevState The previous application state.
 * @param {Object} param.nextState The next application state.
 * @returns {boolean}
 */
const stateChanged = ({ prevState, nextState }) => {
  const prevLinks = getMenuById(prevState, props);
  const nextLinks = getMenuById(nextState, props);

  return prevLinks !== nextLinks;
};

export default consume({
  mapProps,
  stateChanged,
});
