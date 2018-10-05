import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import { hex2bin } from '@shopgate/pwa-common//helpers/data';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCurrentCategories } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  categories: getCurrentCategories(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getCategory(categoryId) {
    dispatch(getCategory(hex2bin(categoryId)));
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
