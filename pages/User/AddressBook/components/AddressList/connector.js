import { connect } from 'react-redux';
import { getUserData, getUserDefaultAddresses } from '@shopgate/pwa-common/selectors/user';
import { setDefaultAddress } from '@shopgate/pwa-common/action-creators/user';

/**
 * @param {Object} state state
 * @return {{addresses: Array}}
 */
const mapStateToProps = state => ({
  addresses: getUserData(state).addresses || [],
  defaults: getUserDefaultAddresses(state) || {},
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  setDefault: (addressId, tag) => dispatch(setDefaultAddress(addressId, tag)),
});

export default connect(mapStateToProps, mapDispatchToProps);
