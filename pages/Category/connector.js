import connect from '@shopgate/pwa-common/helpers/routedConnect';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { resetScrollTopBySort } from 'Components/Navigator/connector';
import {
  getCurrentCategory,
  getCurrentCategoryId,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  category: getCurrentCategory(state, props),
  isRoot: !getCurrentCategoryId(state, props),
  ...getProductsResult(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  getCategory(categoryId) {
    dispatch(getCategory(hex2bin(categoryId)));
  },
  getCategoryProducts(offset, limit, sort) {
    const categoryId = getCurrentCategoryId({}, props);

    if (!categoryId) {
      return;
    }

    dispatch(resetScrollTopBySort(sort));
    dispatch(fetchCategoryProducts(categoryId, offset, limit, sort));
  },
});

/**
 * Connects a component to the category store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const category = Component =>
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Component)
;

export default category;
