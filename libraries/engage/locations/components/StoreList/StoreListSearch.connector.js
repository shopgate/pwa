import { connect } from 'react-redux';
import { makeGetIsFetchingProductLocations } from '../../selectors';
import { getProductLocations } from './StoreListSearch.actions';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getIsFetchingProductLocations = makeGetIsFetchingProductLocations();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    loading: getIsFetchingProductLocations(state, props),
  });
};

const mapDispatchToProps = { getProductLocations };

export default connect(makeMapStateToProps, mapDispatchToProps);
