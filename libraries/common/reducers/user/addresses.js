import appConfig from '../../helpers/config';
import { RECEIVE_USER, SET_DEFAULT_ADDRESS, SUCCESS_LOGOUT } from '../../constants/ActionTypes';

const { user: { addresses: { splitDefaultsByTags } } } = appConfig;

/**
 * Stores the user addresses
 * @param {Object} state The current user state
 * @param {Object} action The action object
 * @return {Object} The new state
 */
export default (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_USER: {
      const { addresses } = action.user;

      const defaultAddresses = {};
      splitDefaultsByTags.forEach((tag) => {
        const defA = addresses.find(a => a.tags && a.tags.includes(tag));
        defaultAddresses[tag] = defA ? defA.id : null;
      });

      return {
        ...state,
        default: defaultAddresses,
      };
    }
    case SET_DEFAULT_ADDRESS: {
      return {
        ...state,
        default: {
          ...state.default,
          [action.tag]: action.addressId,
        },
      };
    }
    case SUCCESS_LOGOUT:
      return {};
    default:
      return state;
  }
};
