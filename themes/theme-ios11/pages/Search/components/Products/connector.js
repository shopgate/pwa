import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  ...getProductsResult(state, props),
});

const mapDispatchToProps = {
  getProducts: (searchPhrase, offset) => getSearchResults({ searchPhrase, offset }),
};

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.products, next.products)) {
    return false;
  }

  if (prev.totalProductCount !== next.totalProductCount) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
