import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { QUICKLINKS_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import { getMenuById } from '@shopgate/pwa-common/selectors/menu';

const props = {
  id: QUICKLINKS_MENU,
};

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  links: getMenuById(state, props),
});

/**
 * Maps the contents of the state to the component props.
 * @param {Object} dispatch The dispatch method from the store.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (pathname, title) => dispatch(historyPush({
    pathname,
    state: { title },
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
