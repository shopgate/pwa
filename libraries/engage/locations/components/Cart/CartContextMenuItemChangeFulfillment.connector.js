// @flow
import { connect } from 'react-redux';
import { makeGetEnabledFulfillmentMethods } from '../../../core/config';

/**
 * @return {Function} The extended component props.
 */
function makeMapStateToProps() {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return state => ({
    shopFulfillmentMethods: getEnabledFulfillmentMethods(state),
  });
}

export default connect(makeMapStateToProps);
