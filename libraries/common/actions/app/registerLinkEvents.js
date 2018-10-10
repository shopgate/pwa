import { event, registerEvents } from '@shopgate/pwa-core';
import { willRegisterLinkEvents, didRegisterLinkEvents } from '../../action-creators/app';
import handlePushNotification from './handlePushNotification';
import handleDeepLink from './handleDeepLink';

/**
 * Registers all link events.
 * @return {Function} A redux thunk.
 */
export default function registerLinkEvents() {
  return (dispatch) => {
    dispatch(willRegisterLinkEvents());

    registerEvents([
      'openPushNotification',
      'openDeepLink',
    ]);

    event.addCallback('openPushNotification', payload => (
      dispatch(handlePushNotification(payload))
    ));

    event.addCallback('openDeepLink', payload => (
      dispatch(handleDeepLink(payload))
    ));

    dispatch(didRegisterLinkEvents());
  };
}
