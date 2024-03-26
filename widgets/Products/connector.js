import { connect } from 'react-redux';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { showInventoryInLists } from '@shopgate/engage/locations/helpers';
import {
  getProductsResult,
  getProductsFetchingState,
} from '../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component properties.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const hasInventoryInLists = showInventoryInLists(state);

  const params = [
    state,
    props.settings.queryType,
    {
      sort: props.settings.sortOrder,
      value: props.settings.queryParams,
      /**
       * When the "showInventoryInLists" feature is active, productId list based widgets must
       * request and select data like the other widget types so that inventory data fetching
       * works as expected.
       */
      ...(hasInventoryInLists ? {
        useProductHashForProductIds: true,
      } : null),
    },
    props.id,
  ];

  return {
    ...getProductsResult(...params),
    isFetching: getProductsFetchingState(...params),
  };
};

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts: (type, value, options, id) => {
    dispatch((_, getState) => {
      const hasInventoryInLists = showInventoryInLists(getState());
      dispatch(fetchProductsByQuery(type, value, {
        ...options,
        ...(hasInventoryInLists ? {
          /**
           * When the "showInventoryInLists" feature is active, productId list based widgets must
           * request and select data like the other widget types so that inventory data fetching
           * works as expected.
           */
          useProductHashForProductIds: true,
        } : null),
      }, id));
    });
  },
});

/**
 * Check to see if the component props have even changed.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.products.length !== next.products.length) return false;
  if (prev.totalProductCount !== next.totalProductCount) return false;
  if (prev.isFetching !== next.isFetching) return false;
  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
