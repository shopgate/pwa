import { connect } from 'react-redux';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import { getMenuById } from '@shopgate/pwa-common/selectors/menu';
import { getIsBackInStockEnabled } from '@shopgate/engage/back-in-stock';

const props = {
  id: QUICKLINKS_MENU,
};

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  entries: getMenuById(state, props),
  isBackInStockEnabled: getIsBackInStockEnabled(state, props),
});

export default connect(mapStateToProps);
