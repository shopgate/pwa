import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import ParsedLink from '../components/Router/helpers/parsed-link';
import getUser from '../actions/user/getUser';
import { successLogin } from '../action-creators/user';
import { appDidStart$ } from '../streams/app';
import {
  userWillLogin$,
  userLoginResponse$,
  userDidLogin$,
  userDidLogout$,
  legacyConnectRegisterDidFail$,
  userSetDefaultAddress$,
} from '../streams/user';
import setViewLoading from '../actions/view/setViewLoading';
import unsetViewLoading from '../actions/view/unsetViewLoading';
import showModal from '../actions/modal/showModal';
import { LOGIN_PATH } from '../constants/RoutePaths';
import { LEGACY_URL_CONNECT_REGISTER } from '../constants/Registration';
import { getUserAddressIdSelector } from './../selectors/user';
import updateAddress from './../actions/user/updateAddress';

/**
 * User subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  /**
   * Gets triggered when ever the user data need to be updated.
   */
  const userNeedsUpdate$ = appDidStart$.merge(userDidLogin$);

  subscribe(userWillLogin$, ({ dispatch }) => {
    dispatch(setViewLoading(LOGIN_PATH));
  });

  subscribe(userLoginResponse$, ({ dispatch }) => {
    dispatch(unsetViewLoading(LOGIN_PATH));
  });

  subscribe(userNeedsUpdate$, ({ dispatch }) => {
    dispatch(getUser());
  });

  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message: 'login.logout_message',
      title: null,
    }));
  });

  subscribe(appDidStart$, ({ dispatch }) => {
    registerEvents(['userLoggedIn']);

    event.addCallback('userLoggedIn', () => dispatch(successLogin()));
  });

  subscribe(legacyConnectRegisterDidFail$, () => {
    const link = new ParsedLink(`/${LEGACY_URL_CONNECT_REGISTER}`);
    link.open();
  });

  // Redux state already changed in reducer,
  // Dispatch action to backend to sync user selection
  subscribe(userSetDefaultAddress$, ({ dispatch, action, getState }) => {
    const { addressId, tag } = action;
    const address = getUserAddressIdSelector(getState())(addressId);

    // Tag is prefixed with default_ for shipping, billing, etc
    const defTag = tag === 'default' ? tag : `default_${tag}`;

    // No address or already is default
    if (!address || (address.tags && address.tags.includes(defTag))) {
      return;
    }
    if (!address.tags) {
      address.tags = [];
    }

    address.tags.push(defTag);
    dispatch(updateAddress(address));
  });
}
