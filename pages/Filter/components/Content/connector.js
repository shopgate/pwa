import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getAvailableFilters, getTemporaryFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import mergeTemporaryFilters from '@shopgate/pwa-common-commerce/filter/action-creators/mergeTemporaryFilters';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import { getQueryParamsAsString } from '@shopgate/pwa-common/selectors/history';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  availableFilters: getAvailableFilters(state, props),
  temporaryFilters: getTemporaryFilters(state),
  queryParams: getQueryParamsAsString(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  mergeTemporaryFilters: temporaryFilters => dispatch(mergeTemporaryFilters(temporaryFilters)),
  removeTemporaryFilter: (id, index) => dispatch(removeTemporaryFilter(id, index)),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.availableFilters, next.availableFilters)) {
    return false;
  }

  if (!isEqual(prev.temporaryFilters, next.temporaryFilters)) {
    return false;
  }

  if (prev.queryParams !== next.queryParams) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
