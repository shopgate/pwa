import { connect } from 'react-redux';
import mergeTemporaryFilters from '@shopgate/pwa-common-commerce/filter/action-creators/mergeTemporaryFilters';
import removeTemporaryFilter from '@shopgate/pwa-common-commerce/filter/action-creators/removeTemporaryFilter';
import { getCurrentFilterAttribute, getTemporaryFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import {
  setFilterAttributeOpened,
  setFilterAttributeClosed,
} from 'Components/Navigator/action-creators';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  temporaryFilters: getTemporaryFilters(state),
  currentAttribute: getCurrentFilterAttribute(state, props),
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
  removeTemporaryFilter: (id, index) => dispatch(removeTemporaryFilter(id, index)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true });
