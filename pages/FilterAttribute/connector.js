import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import mergeTemporaryFilters from '@shopgate/pwa-common-commerce/filter/action-creators/mergeTemporaryFilters';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import { getCurrentFilterAttribute } from '@shopgate/pwa-common-commerce/filter/selectors';
import {
  setFilterAttributeOpened,
  setFilterAttributeClosed,
} from 'Components/Navigator/action-creators';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  temporaryFilters: state.filter.temporaryFilters,
  currentAttribute: getCurrentFilterAttribute(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  mergeTemporaryFilters: temporaryFilters => dispatch(mergeTemporaryFilters(temporaryFilters)),
  setFilterAttributeClosed: () => dispatch(setFilterAttributeClosed()),
  setFilterAttributeOpened: () => dispatch(setFilterAttributeOpened()),
  removeTemporaryFilter: (...args) => dispatch(removeTemporaryFilter(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
