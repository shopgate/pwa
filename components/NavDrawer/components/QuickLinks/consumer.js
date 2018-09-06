import { consume } from 'redux-props';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import { makeGetMenuById } from '../../selectors';

const getMenuById = makeGetMenuById();

/**
 * @returns {Object}
 */
const mapProps = ({ dispatch, state }) => ({
  links: getMenuById(state, { id: QUICKLINKS_MENU }),
  // links: getMenuById(state, { id: QUICKLINKS_MENU }),
  navigate: (pathname, title) => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

export default consume({ mapProps });
