import connect from '@shopgate/pwa-common/helpers/routedConnect';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isVisible: (getCategoryProductCount(state) === 0 && getCurrentCategoryChildCount(state) === 0),
});

export default connect(mapStateToProps);
